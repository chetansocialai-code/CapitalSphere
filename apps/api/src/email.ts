import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || process.env.EMAIL_SERVER || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USERNAME || '';
const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'CapitalSphere Security <noreply@capitalsphere.online>';

// Create Nodemailer Transporter
const transporter = SMTP_HOST && SMTP_USER ? nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
}) : null;

// Send Account Verification Email
export async function sendVerificationEmail(toEmail: string, verificationUrl: string) {
  const subject = 'Verify your CapitalSphere account';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0E14; color: #FFFFFF; padding: 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://res.cloudinary.com/dtzyjynai/image/upload/v1787160480/c9014f75-543b-4908-aa38-94a839e8670c-removebg-preview_mj92p5.png" alt="CapitalSphere" style="height: 48px;" />
      </div>
      <h2 style="color: #4DA3FF; text-align: center;">Verify Your CapitalSphere Account</h2>
      <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
        Welcome to CapitalSphere — Markets. Money. Business. Intelligence. Please verify your email address to activate your account and access personalized watchlists, options analytics, and AI intelligence.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verificationUrl}" style="background-color: #4DA3FF; color: #0A0E14; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 8px; inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #64748B; font-size: 12px; text-align: center;">
        If you did not request this account creation, please ignore this message.
      </p>
      <hr style="border-color: #1E293B; margin-top: 24px;" />
      <p style="color: #475569; font-size: 11px; text-align: center;">
        © 2026 CapitalSphere (www.capitalsphere.online). All rights reserved.
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      console.log(`✉️ Real Verification Email dispatched to ${toEmail}`);
    } catch (err) {
      console.error('Failed to dispatch real SMTP email:', err);
    }
  } else {
    console.log(`====================================================`);
    console.log(`[SIMULATED EMAIL SERVICE] Verification Email for ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log(`====================================================`);
  }
}

// Send Password Reset Email
export async function sendPasswordResetEmail(toEmail: string, resetUrl: string) {
  const subject = 'Reset your CapitalSphere password';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0E14; color: #FFFFFF; padding: 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://res.cloudinary.com/dtzyjynai/image/upload/v1787160480/c9014f75-543b-4908-aa38-94a839e8670c-removebg-preview_mj92p5.png" alt="CapitalSphere" style="height: 48px;" />
      </div>
      <h2 style="color: #F2B84B; text-align: center;">Reset Your CapitalSphere Password</h2>
      <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
        We received a request to reset your CapitalSphere account password. Click the button below to set a new password. This single-use link expires in 60 minutes.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #F2B84B; color: #0A0E14; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 8px; inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #64748B; font-size: 12px; text-align: center;">
        If you did not request a password reset, your account is safe and no action is needed.
      </p>
      <hr style="border-color: #1E293B; margin-top: 24px;" />
      <p style="color: #475569; font-size: 11px; text-align: center;">
        © 2026 CapitalSphere (www.capitalsphere.online). All rights reserved.
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      console.log(`✉️ Real Password Reset Email dispatched to ${toEmail}`);
    } catch (err) {
      console.error('Failed to dispatch real SMTP email:', err);
    }
  } else {
    console.log(`====================================================`);
    console.log(`[SIMULATED EMAIL SERVICE] Password Reset Email for ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`====================================================`);
  }
}
