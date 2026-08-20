'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Incorrect email or password.');
      }

      localStorage.setItem('cs_token', json.token);
      localStorage.setItem('cs_user', JSON.stringify(json.user));

      setSuccess('Authentication successful! Redirecting to dashboard...');
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('Google OAuth credentials not configured in production environment. Please sign in with Email.');
  };

  return (
    <div className="max-w-md w-full cs-card border rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#4DA3FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#4DA3FF]/10 border border-[#4DA3FF]/30 text-[#4DA3FF] text-3xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22C58B]" /> SECURE EMAIL LOGIN
        </div>
        <h1 className="text-2xl font-extrabold font-sans text-white">
          Sign In to <span className="text-[#4DA3FF]">CapitalSphere</span>
        </h1>
        <p className="text-xs cs-text-sub font-mono">
          Access your Watchlist, Options Terminal & AI Intelligence
        </p>
      </div>

      {error && (
        <div className="cs-topbar border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2 font-sans">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="cs-topbar border border-[#22C58B]/30 text-[#22C58B] p-3.5 rounded-xl text-xs flex items-start gap-2 font-sans">
          <CheckCircle2 className="w-4 h-4 text-[#22C58B] shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
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
        <span>Or Continue with Email</span>
        <span className="flex-1 border-t cs-border"></span>
      </div>

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

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono font-semibold cs-text-sub">Password</label>
            <Link href="/forgot-password" className="text-3xs font-mono text-[#4DA3FF] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 cs-text-sub" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t cs-border text-center text-xs font-mono cs-text-sub">
        Don't have an account?{' '}
        <Link href="/signup" className="text-[#4DA3FF] font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="font-mono text-xs cs-text-sub">Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
