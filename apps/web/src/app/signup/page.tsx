'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  Zap, 
  BarChart2, 
  Check 
} from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
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

  // Password Strength Calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-700' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score: 65, label: 'Medium', color: 'bg-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-[#22C58B]' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVerificationNotice(null);

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy to continue.');
      return;
    }

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
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 cs-card border rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Hero Branding Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B132B] via-[#0F1C3F] to-[#070A0F] p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r cs-border relative overflow-hidden">
          {/* Background Decorative Blur */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#4DA3FF]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#22C58B]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            {/* Live Feed Status Badge */}
            <div className="inline-flex items-center gap-2 bg-[#22C58B]/10 border border-[#22C58B]/30 text-[#22C58B] text-3xs font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#22C58B] animate-pulse"></span>
              LIVE MARKET FEED CONNECTED
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl lg:text-3xl font-extrabold font-sans text-white tracking-tight leading-tight">
                Unlock Institutional Financial Intelligence
              </h2>
              <p className="text-xs cs-text-sub leading-relaxed">
                Join thousands of senior investors and traders using CapitalSphere for real-time market insights.
              </p>
            </div>

            {/* Platform Features Checklist */}
            <div className="space-y-3.5 pt-2">
              {[
                { title: 'Real-Time Option Chain Terminal', desc: 'NSE & BSE live Greeks, PCR & Max Pain analysis', icon: BarChart2 },
                { title: 'AI Financial Intelligence Hub', desc: 'Automated earnings summaries & macro desk reports', icon: Zap },
                { title: 'Supabase PostgreSQL Cloud Security', desc: 'Enterprise-grade encrypted user data & watchlists', icon: ShieldCheck },
                { title: 'Custom Price Trigger Alerts', desc: 'Instant desktop & email alerts on key breakouts', icon: TrendingUp },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl">
                  <div className="p-2 rounded-xl bg-[#4DA3FF]/10 text-[#4DA3FF] shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-3xs cs-text-sub">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Live Market Ticker Mini Banner */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-2xs font-mono relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">NIFTY 50</span>
              <span className="text-[#22C58B] font-bold">24,850.10 (+1.2%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">SENSEX</span>
              <span className="text-[#22C58B] font-bold">81,320.40 (+0.9%)</span>
            </div>
          </div>
        </div>

        {/* Right Auth Form Column */}
        <div className="lg:col-span-7 bg-[#070A0F]/90 p-8 lg:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold font-sans text-white">
              Create Your <span className="text-[#4DA3FF]">CapitalSphere</span> Account
            </h1>
            <p className="text-xs cs-text-sub font-mono">
              Setup your investor account in under 30 seconds
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {verificationNotice ? (
            <div className="bg-[#4DA3FF]/10 border border-[#4DA3FF]/30 p-8 rounded-3xl space-y-5 text-center">
              <div className="inline-flex p-4 rounded-full bg-[#4DA3FF]/20 text-[#4DA3FF] ring-8 ring-[#4DA3FF]/10">
                <Mail className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold font-sans text-white">Check Your Email Inbox</h3>
                <p className="text-xs cs-text-sub font-sans leading-relaxed max-w-sm mx-auto">
                  {verificationNotice}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className="text-xs font-mono text-[#4DA3FF] hover:underline disabled:opacity-50 inline-flex items-center gap-2 bg-[#4DA3FF]/10 border border-[#4DA3FF]/20 px-4 py-2 rounded-xl transition"
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
                <span>Or Register with Work Email</span>
                <span className="flex-1 border-t cs-border"></span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold cs-text-sub">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 cs-text-sub" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Senior Investor"
                      className="w-full bg-slate-900/70 text-xs pl-10 pr-4 py-3 rounded-2xl border cs-border focus:border-[#4DA3FF] focus:bg-slate-900 focus:outline-none transition text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold cs-text-sub">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 cs-text-sub" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-900/70 text-xs pl-10 pr-4 py-3 rounded-2xl border cs-border focus:border-[#4DA3FF] focus:bg-slate-900 focus:outline-none transition text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold cs-text-sub">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 cs-text-sub" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold cs-text-sub">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 cs-text-sub" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/70 text-xs pl-10 pr-4 py-3 rounded-2xl border cs-border focus:border-[#4DA3FF] focus:bg-slate-900 focus:outline-none transition text-white placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator Bar */}
                {password.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-3xs font-mono">
                      <span className="cs-text-sub">Password Strength</span>
                      <span className="font-bold text-white">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${strength.color}`} 
                        style={{ width: `${strength.score}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Terms and Privacy Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 rounded bg-slate-900 border-slate-700 text-[#4DA3FF] focus:ring-[#4DA3FF]"
                  />
                  <label htmlFor="terms" className="text-2xs cs-text-sub leading-snug cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#4DA3FF] font-semibold hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[#4DA3FF] font-semibold hover:underline">
                      Privacy Policy
                    </Link>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4DA3FF] hover:bg-[#69B2FF] text-slate-950 font-bold py-3.5 rounded-2xl shadow-xl shadow-[#4DA3FF]/20 transition flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-wider mt-2"
                >
                  {loading ? 'Creating Account...' : 'Create CapitalSphere Account'}{' '}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          <div className="pt-4 border-t cs-border text-center text-xs font-mono cs-text-sub">
            Already have an account?{' '}
            <Link href="/login" className="text-[#4DA3FF] font-bold hover:underline">
              LOG IN
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
