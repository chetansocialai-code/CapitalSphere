import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'capitalsphere_production_super_secret_jwt_key_2026_finance_platform';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  emailVerified: boolean;
  role: 'USER' | 'EDITOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface VerificationToken {
  id: string;
  email: string;
  tokenHash: string;
  expiresAt: number;
}

export interface PasswordResetToken {
  id: string;
  email: string;
  tokenHash: string;
  expiresAt: number;
}

export interface CapitalSphereApiKey {
  id: string;
  userId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  createdAt: string;
  lastUsedAt?: string;
}

// In-Memory Production Data Store with initial hashed users
const usersDb: Record<string, UserAccount> = {};
const verificationTokensDb: Record<string, VerificationToken> = {};
const resetTokensDb: Record<string, PasswordResetToken> = {};
const userWatchlistsDb: Record<string, string[]> = {};
const userApiKeysDb: Record<string, CapitalSphereApiKey[]> = {};
const apiKeysLookupDb: Record<string, CapitalSphereApiKey> = {}; // Key hash -> ApiKey object
const rateLimitsDb: Record<string, { attempts: number; resetAt: number }> = {};

// Initialize Default Verified Admin & User Accounts (bcrypt hashed)
async function seedDefaultUsers() {
  const adminPasswordHash = await bcrypt.hash('CapitalSphere2026Admin!', 10);
  const userPasswordHash = await bcrypt.hash('CapitalSphere2026User!', 10);

  const adminId = 'usr_admin_001';
  usersDb['admin@capitalsphere.online'] = {
    id: adminId,
    email: 'admin@capitalsphere.online',
    name: 'CapitalSphere Admin',
    passwordHash: adminPasswordHash,
    emailVerified: true,
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  userWatchlistsDb[adminId] = ['RELIANCE', 'TCS', 'HDFCBANK', 'NIFTY 50'];

  const userId = 'usr_investor_001';
  usersDb['investor@capitalsphere.online'] = {
    id: userId,
    email: 'investor@capitalsphere.online',
    name: 'Senior Investor',
    passwordHash: userPasswordHash,
    emailVerified: true,
    role: 'USER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  userWatchlistsDb[userId] = ['INFY', 'ICICIBANK', 'TATAMOTORS', 'SENSEX'];

  // Create initial demo API Key for Senior Investor
  createApiKeyForUser(userId, 'Production Algorithmic Trading Key');
}

seedDefaultUsers();

// Rate Limiter Check (Max 5 attempts per 15 mins)
export function checkRateLimit(ipOrEmail: string): boolean {
  const now = Date.now();
  const entry = rateLimitsDb[ipOrEmail];
  if (!entry) return true;

  if (now > entry.resetAt) {
    delete rateLimitsDb[ipOrEmail];
    return true;
  }

  return entry.attempts < 5;
}

export function registerFailedAttempt(ipOrEmail: string) {
  const now = Date.now();
  const entry = rateLimitsDb[ipOrEmail] || { attempts: 0, resetAt: now + 15 * 60 * 1000 };
  entry.attempts += 1;
  rateLimitsDb[ipOrEmail] = entry;
}

export function clearRateLimit(ipOrEmail: string) {
  delete rateLimitsDb[ipOrEmail];
}

// User Registration
export async function registerUser(email: string, passwordPlain: string, name?: string) {
  const normalizedEmail = email.toLowerCase().trim();
  if (usersDb[normalizedEmail]) {
    throw new Error('An account with this email address already exists.');
  }

  const passwordHash = await bcrypt.hash(passwordPlain, 10);
  const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
  const newUser: UserAccount = {
    id: userId,
    email: normalizedEmail,
    name: name || normalizedEmail.split('@')[0],
    passwordHash,
    emailVerified: false,
    role: 'USER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  usersDb[normalizedEmail] = newUser;
  userWatchlistsDb[userId] = ['RELIANCE', 'TCS', 'NIFTY 50'];

  // Generate Verification Token (24-hour expiry)
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  verificationTokensDb[rawToken] = {
    id: `tok_${crypto.randomBytes(8).toString('hex')}`,
    email: normalizedEmail,
    tokenHash,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      emailVerified: newUser.emailVerified,
      role: newUser.role,
    },
    verificationToken: rawToken,
    verificationUrl: `https://www.capitalsphere.online/verify-email?token=${rawToken}`,
  };
}

// User Authentication
export async function authenticateUser(email: string, passwordPlain: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = usersDb[normalizedEmail];

  if (!user) {
    throw new Error('Incorrect email or password.');
  }

  const isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Incorrect email or password.');
  }

  if (!user.emailVerified) {
    throw new Error('Account not verified. Please check your inbox for the verification link.');
  }

  user.lastLoginAt = new Date().toISOString();

  // Create JWT Session Token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      role: user.role,
    },
    token,
  };
}

// Verify Email Address
export async function verifyEmailToken(token: string) {
  const entry = verificationTokensDb[token];
  if (!entry) {
    throw new Error('Invalid or expired verification link.');
  }

  if (Date.now() > entry.expiresAt) {
    delete verificationTokensDb[token];
    throw new Error('Verification link has expired. Please request a new one.');
  }

  const user = usersDb[entry.email];
  if (!user) {
    throw new Error('Account not found.');
  }

  user.emailVerified = true;
  user.updatedAt = new Date().toISOString();
  delete verificationTokensDb[token];

  // Auto-login session after verification
  const sessionToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      role: user.role,
    },
    token: sessionToken,
  };
}

// Password Reset Request
export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = usersDb[normalizedEmail];

  const genericResponse = {
    message: "If an account exists for this email, we've sent instructions to reset your password.",
  };

  if (!user) return genericResponse;

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  resetTokensDb[rawToken] = {
    id: `rst_${crypto.randomBytes(8).toString('hex')}`,
    email: normalizedEmail,
    tokenHash,
    expiresAt: Date.now() + 1 * 60 * 60 * 1000,
  };

  return {
    ...genericResponse,
    resetToken: rawToken,
    resetUrl: `https://www.capitalsphere.online/reset-password?token=${rawToken}`,
  };
}

// Reset Password Execution
export async function resetPasswordWithToken(token: string, newPasswordPlain: string) {
  const entry = resetTokensDb[token];
  if (!entry) {
    throw new Error('Invalid or expired password reset token.');
  }

  if (Date.now() > entry.expiresAt) {
    delete resetTokensDb[token];
    throw new Error('Password reset token has expired. Please request a new one.');
  }

  const user = usersDb[entry.email];
  if (!user) {
    throw new Error('Account not found.');
  }

  user.passwordHash = await bcrypt.hash(newPasswordPlain, 10);
  user.updatedAt = new Date().toISOString();
  delete resetTokensDb[token];

  return {
    message: 'Your password has been successfully reset. Please log in with your new password.',
  };
}

// Verify JWT Token Payload
export function verifyJwtToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: 'USER' | 'EDITOR' | 'ADMIN' };
    const user = Object.values(usersDb).find(u => u.id === decoded.userId);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      role: user.role,
    };
  } catch (err) {
    return null;
  }
}

// CapitalSphere API Key Management Engine
export function createApiKeyForUser(userId: string, keyName?: string) {
  const randomHex = crypto.randomBytes(24).toString('hex');
  const rawApiKey = `cs_live_${randomHex}`;
  const keyPrefix = rawApiKey.substring(0, 15);
  const keyHash = crypto.createHash('sha256').update(rawApiKey).digest('hex');

  const apiKeyObj: CapitalSphereApiKey = {
    id: `key_${crypto.randomBytes(8).toString('hex')}`,
    userId,
    name: keyName || 'My CapitalSphere API Key',
    keyPrefix: `${keyPrefix}...`,
    keyHash,
    createdAt: new Date().toISOString(),
  };

  const userKeys = userApiKeysDb[userId] || [];
  userKeys.push(apiKeyObj);
  userApiKeysDb[userId] = userKeys;
  apiKeysLookupDb[keyHash] = apiKeyObj;

  return {
    apiKey: rawApiKey,
    keyDetails: apiKeyObj,
  };
}

export function getUserApiKeys(userId: string): CapitalSphereApiKey[] {
  return userApiKeysDb[userId] || [];
}

export function deleteApiKeyForUser(userId: string, keyId: string): boolean {
  const keys = userApiKeysDb[userId] || [];
  const targetKey = keys.find(k => k.id === keyId);
  if (!targetKey) return false;

  userApiKeysDb[userId] = keys.filter(k => k.id !== keyId);
  delete apiKeysLookupDb[targetKey.keyHash];
  return true;
}

export function validateApiKey(rawApiKey: string): CapitalSphereApiKey | null {
  if (!rawApiKey.startsWith('cs_live_') && !rawApiKey.startsWith('cs_test_')) {
    return null;
  }

  const keyHash = crypto.createHash('sha256').update(rawApiKey).digest('hex');
  const apiKeyObj = apiKeysLookupDb[keyHash];
  if (!apiKeyObj) return null;

  apiKeyObj.lastUsedAt = new Date().toISOString();
  return apiKeyObj;
}

// Watchlist Persistence per User ID
export function getUserWatchlist(userId: string): string[] {
  return userWatchlistsDb[userId] || ['RELIANCE', 'TCS', 'NIFTY 50'];
}

export function addToUserWatchlist(userId: string, symbol: string): string[] {
  const current = userWatchlistsDb[userId] || [];
  const upper = symbol.toUpperCase();
  if (!current.includes(upper)) {
    current.push(upper);
  }
  userWatchlistsDb[userId] = current;
  return current;
}

export function removeFromUserWatchlist(userId: string, symbol: string): string[] {
  const current = userWatchlistsDb[userId] || [];
  const upper = symbol.toUpperCase();
  const updated = current.filter(s => s !== upper);
  userWatchlistsDb[userId] = updated;
  return updated;
}
