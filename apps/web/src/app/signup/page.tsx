'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVerificationNotice(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please confirm your password.');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Signup failed.');
      }

      setVerificationNotice(json.message || 'Verification link sent to your email address.');
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Could not complete signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setVerificationNotice('A fresh verification link has been re-sent to your email address.');
    setCooldown(60);
  };

  const handleGoogleSignup = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full cs-card border rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#22C58B]/10 border border-[#22C58B]/30 text-[#22C58B] text-3xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> CREATE ACCOUNT
          </div>
          <h1 className="text-2xl font-extrabold font-sans text-white">
            Create Your <span className="text-[#4DA3FF]">CapitalSphere</span> Account
          </h1>
          <p className="text-xs cs-text-sub font-mono">
            Get personalized Watchlists, Portfolio & Market Alerts
          </p>
        </div>

        {error && (
          <div className="cs-topbar border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2 font-sans">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {verificationNotice ? (
          <div className="cs-topbar border border-[#4DA3FF]/30 p-6 rounded-2xl space-y-4 text-center">
            <div className="inline-flex p-3 rounded-full bg-[#4DA3FF]/15 text-[#4DA3FF]">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold font-sans text-white">Check Your Inbox</h3>
              <p className="text-xs cs-text-sub font-sans leading-relaxed">
                {verificationNotice}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleResend}
                disabled={cooldown > 0}
                className="text-xs font-mono text-[#4DA3FF] hover:underline disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cooldown > 0 ? 'animate-spin' : ''}`} />
                {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend verification email'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignup}
              type="button"
              className="w-full cs-topbar hover:bg-slate-700/40 border cs-border py-2.5 px-4 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 text-3xs font-mono cs-text-sub uppercase">
              <span className="flex-1 border-t cs-border"></span>
              <span>Or Register with Email</span>
              <span className="flex-1 border-t cs-border"></span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold cs-text-sub">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 cs-text-sub" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Senior Investor"
                    className="w-full cs-card text-xs pl-9 pr-4 py-2.5 rounded-xl border focus:border-[#4DA3FF] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold cs-text-sub">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 cs-text-sub" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full cs-card text-xs pl-9 pr-4 py-2.5 rounded-xl border focus:border-[#4DA3FF] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold cs-text-sub">Password (Min 8 characters)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 cs-text-sub" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full cs-card text-xs pl-9 pr-4 py-2.5 rounded-xl border focus:border-[#4DA3FF] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold cs-text-sub">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 cs-text-sub" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full cs-card text-xs pl-9 pr-4 py-2.5 rounded-xl border focus:border-[#4DA3FF] focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4DA3FF] hover:bg-[#69B2FF] text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-[#4DA3FF]/20 transition flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-wider"
              >
                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

        <div className="pt-4 border-t cs-border text-center text-xs font-mono cs-text-sub">
          Already have an account?{' '}
          <Link href="/login" className="text-[#4DA3FF] font-bold hover:underline">
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
