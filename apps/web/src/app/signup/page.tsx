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
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
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
      if (json.verificationUrl) {
        setVerificationUrl(json.verificationUrl);
      }
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Could not complete signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setVerificationNotice('A fresh verification link has been re-sent to your email.');
    setCooldown(60);
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
          <div className="cs-topbar border border-[#4DA3FF]/30 p-5 rounded-2xl space-y-4 text-center">
            <div className="inline-flex p-3 rounded-full bg-[#4DA3FF]/15 text-[#4DA3FF]">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-sans text-white">Check Your Email</h3>
              <p className="text-xs cs-text-sub font-sans">
                {verificationNotice}
              </p>
            </div>

            {verificationUrl && (
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 text-2xs font-mono text-[#4DA3FF] break-all">
                <span className="text-slate-400 block text-3xs uppercase font-bold mb-1">Simulated Direct Verification Link:</span>
                <a href={verificationUrl} className="underline hover:text-blue-400">
                  {verificationUrl}
                </a>
              </div>
            )}

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
