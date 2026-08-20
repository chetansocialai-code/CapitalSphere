'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      setMessage(json.message || "If an account exists for this email, we've sent instructions to reset your password.");
      if (json.resetUrl) {
        setResetUrl(json.resetUrl);
      }
    } catch (err: any) {
      setError('Could not process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full cs-card border rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#F2B84B]/10 border border-[#F2B84B]/30 text-[#F2B84B] text-3xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> FORGOT PASSWORD
          </div>
          <h1 className="text-2xl font-extrabold font-sans text-white">
            Reset Your Password
          </h1>
          <p className="text-xs cs-text-sub font-mono">
            Enter your account email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="cs-topbar border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2 font-sans">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message ? (
          <div className="cs-topbar border border-[#22C58B]/30 p-5 rounded-2xl space-y-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#22C58B] mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-sans text-white">Instructions Sent</h3>
              <p className="text-xs cs-text-sub font-sans">{message}</p>
            </div>

            {resetUrl && (
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 text-2xs font-mono text-[#4DA3FF] break-all">
                <span className="text-slate-400 block text-3xs uppercase font-bold mb-1">Simulated Direct Password Reset Link:</span>
                <a href={resetUrl} className="underline hover:text-blue-400">
                  {resetUrl}
                </a>
              </div>
            )}

            <div className="pt-2">
              <Link href="/login" className="text-xs font-mono text-[#4DA3FF] hover:underline">
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4DA3FF] hover:bg-[#69B2FF] text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-[#4DA3FF]/20 transition flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-wider"
            >
              {loading ? 'Sending Request...' : 'Send Reset Instructions'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t cs-border text-center text-xs font-mono cs-text-sub">
          Remembered your password?{' '}
          <Link href="/login" className="text-[#4DA3FF] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
