'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Password reset token is missing from URL.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Password reset failed.');
      }

      setSuccess('Your password has been successfully reset! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full cs-card border rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#4DA3FF]/10 border border-[#4DA3FF]/30 text-[#4DA3FF] text-3xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" /> SET NEW PASSWORD
        </div>
        <h1 className="text-2xl font-extrabold font-sans text-white">
          Create New Password
        </h1>
        <p className="text-xs cs-text-sub font-mono">
          Enter your new secure password for CapitalSphere
        </p>
      </div>

      {error && (
        <div className="cs-topbar border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2 font-sans">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="cs-topbar border border-[#22C58B]/30 p-5 rounded-2xl space-y-4 text-center">
          <CheckCircle2 className="w-10 h-10 text-[#22C58B] mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-sans text-white">Password Updated</h3>
            <p className="text-xs cs-text-sub font-sans">{success}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold cs-text-sub">New Password (Min 8 chars)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 cs-text-sub" />
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full cs-card text-xs pl-9 pr-4 py-2.5 rounded-xl border focus:border-[#4DA3FF] focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold cs-text-sub">Confirm New Password</label>
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
            {loading ? 'Updating Password...' : 'Reset Password'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      <div className="pt-4 border-t cs-border text-center text-xs font-mono cs-text-sub">
        Back to{' '}
        <Link href="/login" className="text-[#4DA3FF] font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="font-mono text-xs cs-text-sub">Loading password reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
