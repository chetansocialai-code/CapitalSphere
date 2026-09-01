import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@capitalsphere/database';
import { sendVerificationEmail, sendPasswordResetEmail } from './email';

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

// In-Memory Fallback & Cache Store
const usersDb: Record<string, UserAccount> = {};
const verificationTokensDb: Record<string, VerificationToken> = {};
const resetTokensDb: Record<string, PasswordResetToken> = {};
const userWatchlistsDb: Record<string, string[]> = {};
const userApiKeysDb: Record<string, CapitalSphereApiKey[]> = {};
const apiKeysLookupDb: Record<string, CapitalSphereApiKey> = {};
const rateLimitsDb: Record<string, { attempts: number; resetAt: number }> = {};

// Seed Default Verified Admin & User Accounts to Supabase Database
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

  createApiKeyForUser(userId, 'Production Algorithmic Trading Key');

  try {
    // Sync Admin & Investor User to Supabase PostgreSQL Database
    await prisma.user.upsert({
      where: { email: 'admin@capitalsphere.online' },
      update: { passwordHash: adminPasswordHash, emailVerified: true, role: 'ADMIN' },
      create: {
        id: adminId,
        email: 'admin@capitalsphere.online',
        name: 'CapitalSphere Admin',
        passwordHash: adminPasswordHash,
        emailVerified: true,
        role: 'ADMIN',
      },
    });

    await prisma.user.upsert({
      where: { email: 'investor@capitalsphere.online' },
      update: { passwordHash: userPasswordHash, emailVerified: true, role: 'USER' },
      create: {
        id: userId,
        email: 'investor@capitalsphere.online',
        name: 'Senior Investor',
        passwordHash: userPasswordHash,
        emailVerified: true,
        role: 'USER',
      },
    });
  } catch (err) {
    // Silently continue if database is initializing
  }
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

// Direct Supabase User Registration Server Logic
export async function registerUser(email: string, passwordPlain: string, name?: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const cleanName = (name || '').trim() || normalizedEmail.split('@')[0];

  let existingUser: any = null;
  try {
    existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  } catch (err) {
    existingUser = usersDb[normalizedEmail];
  }

  if (existingUser) {
    if (!existingUser.emailVerified) {
      // Re-issue verification token safely
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      try {
        await prisma.verificationToken.create({
          data: {
            email: normalizedEmail,
            tokenHash,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
      } catch (e) {
        verificationTokensDb[rawToken] = {
          id: `tok_${crypto.randomBytes(8).toString('hex')}`,
          email: normalizedEmail,
          tokenHash,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
      }

      const verificationUrl = `https://www.capitalsphere.online/verify-email?token=${rawToken}`;
      sendVerificationEmail(normalizedEmail, verificationUrl);

      return {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          emailVerified: false,
          role: existingUser.role,
        },
        verificationToken: rawToken,
        verificationUrl,
      };
    }

    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const passwordHash = await bcrypt.hash(passwordPlain, 10);
  const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
  
  let newUser: any = null;
  try {
    newUser = await prisma.user.create({
      data: {
        id: userId,
        email: normalizedEmail,
        name: cleanName,
        passwordHash,
        emailVerified: false,
        role: 'USER',
      },
    });
  } catch (err) {
    newUser = {
      id: userId,
      email: normalizedEmail,
      name: cleanName,
      passwordHash,
      emailVerified: false,
      role: 'USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    usersDb[normalizedEmail] = newUser;
  }

  userWatchlistsDb[userId] = ['RELIANCE', 'TCS', 'NIFTY 50'];

  // Generate Verification Token (24-hour expiry)
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  try {
    await prisma.verificationToken.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  } catch (e) {
    verificationTokensDb[rawToken] = {
      id: `tok_${crypto.randomBytes(8).toString('hex')}`,
      email: normalizedEmail,
      tokenHash,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
  }

  const verificationUrl = `https://www.capitalsphere.online/verify-email?token=${rawToken}`;
  sendVerificationEmail(normalizedEmail, verificationUrl);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      emailVerified: newUser.emailVerified,
      role: newUser.role,
    },
    verificationToken: rawToken,
    verificationUrl,
  };
}

// Direct Supabase User Authentication Server Logic
export async function authenticateUser(email: string, passwordPlain: string) {
  const normalizedEmail = email.toLowerCase().trim();

  let user: any = null;
  try {
    user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  } catch (err) {
    user = usersDb[normalizedEmail];
  }

  if (!user) {
    // Fallback to in-memory seed users if database query failed
    user = usersDb[normalizedEmail];
  }

  if (!user) {
    throw new Error('Email or password is incorrect.');
  }

  const isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Email or password is incorrect.');
  }

  if (!user.emailVerified) {
    throw new Error('Please verify your email before signing in.');
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
  } catch (e) {
    user.lastLoginAt = new Date().toISOString();
  }

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

// Direct Supabase Verify Email Address
export async function verifyEmailToken(token: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  let dbTokenRecord: any = null;
  try {
    dbTokenRecord = await prisma.verificationToken.findFirst({ where: { tokenHash } });
  } catch (e) {
    dbTokenRecord = verificationTokensDb[token];
  }

  const entry = dbTokenRecord || verificationTokensDb[token];

  if (!entry) {
    throw new Error('Invalid or expired verification link.');
  }

  const expiresAtMs = typeof entry.expiresAt === 'number' ? entry.expiresAt : new Date(entry.expiresAt).getTime();
  if (Date.now() > expiresAtMs) {
    try {
      await prisma.verificationToken.delete({ where: { id: entry.id } });
    } catch (e) {
      delete verificationTokensDb[token];
    }
    throw new Error('Verification link has expired. Please request a new one.');
  }

  let user: any = null;
  try {
    user = await prisma.user.findUnique({ where: { email: entry.email } });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    }
  } catch (e) {
    user = usersDb[entry.email];
    if (user) user.emailVerified = true;
  }

  if (!user) {
    user = usersDb[entry.email];
    if (user) user.emailVerified = true;
  }

  if (!user) {
    throw new Error('Account not found.');
  }

  try {
    await prisma.verificationToken.delete({ where: { id: entry.id } });
  } catch (e) {
    delete verificationTokensDb[token];
  }

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
      emailVerified: true,
      role: user.role,
    },
    token: sessionToken,
  };
}

// Direct Supabase Password Reset Request
export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  let user: any = null;
  try {
    user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  } catch (e) {
    user = usersDb[normalizedEmail];
  }

  const genericResponse = {
    message: "If an account exists for this email, we've sent instructions to reset your password.",
    resetUrl: ''
  };

  if (!user) return genericResponse;

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  try {
    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      },
    });
  } catch (e) {
    resetTokensDb[rawToken] = {
      id: `rst_${crypto.randomBytes(8).toString('hex')}`,
      email: normalizedEmail,
      tokenHash,
      expiresAt: Date.now() + 1 * 60 * 60 * 1000,
    };
  }

  const resetUrl = `https://www.capitalsphere.online/reset-password?token=${rawToken}`;
  sendPasswordResetEmail(normalizedEmail, resetUrl);

  return {
    ...genericResponse,
    resetToken: rawToken,
    resetUrl,
  };
}

// Direct Supabase Reset Password Execution
export async function resetPasswordWithToken(token: string, newPasswordPlain: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  let dbTokenRecord: any = null;
  try {
    dbTokenRecord = await prisma.passwordResetToken.findFirst({ where: { tokenHash } });
  } catch (e) {
    dbTokenRecord = resetTokensDb[token];
  }

  const entry = dbTokenRecord || resetTokensDb[token];

  if (!entry) {
    throw new Error('Invalid or expired password reset link.');
  }

  const expiresAtMs = typeof entry.expiresAt === 'number' ? entry.expiresAt : new Date(entry.expiresAt).getTime();
  if (Date.now() > expiresAtMs) {
    try {
      await prisma.passwordResetToken.delete({ where: { id: entry.id } });
    } catch (e) {
      delete resetTokensDb[token];
    }
    throw new Error('Password reset link has expired. Please request a new one.');
  }

  const passwordHash = await bcrypt.hash(newPasswordPlain, 10);

  let user: any = null;
  try {
    user = await prisma.user.findUnique({ where: { email: entry.email } });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, emailVerified: true },
      });
    }
  } catch (e) {
    user = usersDb[entry.email];
    if (user) {
      user.passwordHash = passwordHash;
      user.emailVerified = true;
    }
  }

  if (!user) {
    user = usersDb[entry.email];
    if (user) {
      user.passwordHash = passwordHash;
      user.emailVerified = true;
    }
  }

  if (!user) {
    throw new Error('Account not found.');
  }

  try {
    await prisma.passwordResetToken.delete({ where: { id: entry.id } });
  } catch (e) {
    delete resetTokensDb[token];
  }

  return {
    message: 'Your password has been reset successfully. You can now sign in with your new password.',
  };
}

// User Watchlists Storage
export function getUserWatchlist(userId: string): string[] {
  return userWatchlistsDb[userId] || ['RELIANCE', 'TCS', 'NIFTY 50'];
}

export function addUserWatchlistSymbol(userId: string, symbol: string): string[] {
  const current = getUserWatchlist(userId);
  const upper = symbol.toUpperCase().trim();
  if (!current.includes(upper)) {
    current.push(upper);
  }
  userWatchlistsDb[userId] = current;
  return current;
}

export function removeUserWatchlistSymbol(userId: string, symbol: string): string[] {
  const current = getUserWatchlist(userId);
  const upper = symbol.toUpperCase().trim();
  const updated = current.filter((s) => s !== upper);
  userWatchlistsDb[userId] = updated;
  return updated;
}

// Developer API Key Management
export function createApiKeyForUser(userId: string, name: string) {
  const rawKey = `cs_live_${crypto.randomBytes(24).toString('hex')}`;
  const keyPrefix = rawKey.substring(0, 15);
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

  const record: CapitalSphereApiKey = {
    id: `key_${crypto.randomBytes(8).toString('hex')}`,
    userId,
    name: name.trim() || 'Default API Key',
    keyPrefix,
    keyHash,
    createdAt: new Date().toISOString(),
  };

  const currentKeys = userApiKeysDb[userId] || [];
  currentKeys.push(record);
  userApiKeysDb[userId] = currentKeys;
  apiKeysLookupDb[keyHash] = record;

  return { apiKey: record, keyDetails: record, rawKeySecret: rawKey };
}

export function listUserApiKeys(userId: string): CapitalSphereApiKey[] {
  return userApiKeysDb[userId] || [];
}

export function revokeApiKey(userId: string, keyId: string): boolean {
  const currentKeys = userApiKeysDb[userId] || [];
  const keyToRevoke = currentKeys.find((k) => k.id === keyId);
  if (!keyToRevoke) return false;

  userApiKeysDb[userId] = currentKeys.filter((k) => k.id !== keyId);
  delete apiKeysLookupDb[keyToRevoke.keyHash];
  return true;
}

export function verifyApiKey(rawKey: string): CapitalSphereApiKey | null {
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const record = apiKeysLookupDb[keyHash];
  if (record) {
    record.lastUsedAt = new Date().toISOString();
  }
  return record || null;
}

export function verifyJwtToken(token: string) {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

// Function Aliases for Server Compatibility
export const addToUserWatchlist = addUserWatchlistSymbol;
export const removeFromUserWatchlist = removeUserWatchlistSymbol;
export const getUserApiKeys = listUserApiKeys;
export const deleteApiKeyForUser = revokeApiKey;
export const validateApiKey = verifyApiKey;
