'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Zap, BarChart2, CheckCircle2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const oauthError = searchParams.get('oauth_error');
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Invalid email or password.');
      }

      // Save Token in LocalStorage & Session
      if (json.token) {
        localStorage.setItem('cs_token', json.token);
        localStorage.setItem('cs_user', JSON.stringify(json.user));
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  };

  return (
    <div className="lg:col-span-7 bg-[#070A0F]/90 p-8 lg:p-12 flex flex-col justify-center space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold font-sans text-white">
          Log In to <span className="text-[#4DA3FF]">CapitalSphere</span>
        </h1>
        <p className="text-xs cs-text-sub font-mono">
          Enter your registered email and password to sign in
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full bg-slate-900 hover:bg-slate-800 border cs-border text-white py-3 px-4 rounded-2xl text-xs font-semibold font-mono flex items-center justify-center gap-3 transition shadow-lg hover:border-slate-600"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        Continue with Google Account
      </button>

      <div className="flex items-center gap-3 text-3xs font-mono cs-text-sub uppercase my-2">
        <span className="flex-1 border-t cs-border"></span>
        <span>Or Sign In with Email</span>
        <span className="flex-1 border-t cs-border"></span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold cs-text-sub">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 cs-text-sub" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@capitalsphere.online"
              className="w-full bg-slate-900/70 text-xs pl-10 pr-4 py-3 rounded-2xl border cs-border focus:border-[#4DA3FF] focus:bg-slate-900 focus:outline-none transition text-white placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono font-semibold cs-text-sub">Password</label>
            <Link href="/forgot-password" className="text-2xs font-mono text-[#4DA3FF] hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 cs-text-sub" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900/70 text-xs pl-10 pr-10 py-3 rounded-2xl border cs-border focus:border-[#4DA3FF] focus:bg-slate-900 focus:outline-none transition text-white placeholder:text-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-gray-500 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-[#4DA3FF] focus:ring-[#4DA3FF]"
          />
          <label htmlFor="remember" className="text-2xs cs-text-sub cursor-pointer">
            Keep me signed in on this device
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4DA3FF] hover:bg-[#69B2FF] text-slate-950 font-bold py-3.5 rounded-2xl shadow-xl shadow-[#4DA3FF]/20 transition flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-wider mt-2"
        >
          {loading ? 'Authenticating...' : 'Sign In to Account'}{' '}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t cs-border text-center text-xs font-mono cs-text-sub">
        Don't have an account?{' '}
        <Link href="/signup" className="text-[#4DA3FF] font-bold hover:underline">
          CREATE ACCOUNT
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 cs-card border rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Hero Branding Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B132B] via-[#0F1C3F] to-[#070A0F] p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r cs-border relative overflow-hidden">
          {/* Background Decorative Blur */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#4DA3FF]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#22C58B]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 bg-[#4DA3FF]/10 border border-[#4DA3FF]/30 text-[#4DA3FF] text-3xs font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> SECURE JWT AUTHENTICATION
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl lg:text-3xl font-extrabold font-sans text-white tracking-tight leading-tight">
                Welcome Back to CapitalSphere
              </h2>
              <p className="text-xs cs-text-sub leading-relaxed">
                Access your custom watchlists, portfolio analytics, and live market streaming.
              </p>
            </div>

            {/* Quick Demo Credentials Box */}
            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl space-y-3">
              <span className="text-3xs font-mono uppercase tracking-wider text-[#4DA3FF] font-bold block">
                ⚡ Quick Demo Accounts
              </span>
              
              <div className="space-y-2 text-2xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">Admin Account</span>
                    <span className="text-gray-400">admin@capitalsphere.online</span>
                  </div>
                  <span className="text-3xs bg-[#4DA3FF]/20 text-[#4DA3FF] px-2 py-0.5 rounded uppercase font-bold">
                    ADMIN
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">Senior Investor</span>
                    <span className="text-gray-400">investor@capitalsphere.online</span>
                  </div>
                  <span className="text-3xs bg-[#22C58B]/20 text-[#22C58B] px-2 py-0.5 rounded uppercase font-bold">
                    USER
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live System Indicator */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-2xs font-mono relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C58B] animate-pulse"></span>
              <span className="text-gray-400">Upstox V3 Feed Active</span>
            </div>
            <span className="text-gray-500">v1.4.0 Production</span>
          </div>
        </div>

        {/* Right Form Component Wrapped in Suspense */}
        <Suspense fallback={
          <div className="lg:col-span-7 bg-[#070A0F]/90 p-8 flex items-center justify-center">
            <div className="text-xs font-mono text-[#4DA3FF]">Loading Authentication Portal...</div>
          </div>
        }>
          <LoginFormContent />
        </Suspense>

      </div>
    </div>
  );
}
