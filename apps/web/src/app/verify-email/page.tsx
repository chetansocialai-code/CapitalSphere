'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Verification token is missing from URL.');
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Email verification failed.');
        }

        if (json.token) {
          localStorage.setItem('cs_token', json.token);
          localStorage.setItem('cs_user', JSON.stringify(json.user));
        }

        setSuccess(json.message || 'Email verified successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Verification link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="max-w-md w-full cs-card border rounded-2xl p-8 shadow-2xl space-y-6 text-center">
      <div className="inline-flex items-center gap-1.5 bg-[#4DA3FF]/10 border border-[#4DA3FF]/30 text-[#4DA3FF] text-3xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5" /> EMAIL VERIFICATION
      </div>

      {loading && (
        <div className="space-y-4 py-8">
          <RefreshCw className="w-8 h-8 text-[#4DA3FF] animate-spin mx-auto" />
          <h2 className="text-sm font-mono font-bold text-white">Verifying your email address...</h2>
        </div>
      )}

      {success && (
        <div className="space-y-4 py-6">
          <CheckCircle2 className="w-12 h-12 text-[#22C58B] mx-auto" />
          <h2 className="text-lg font-bold font-sans text-white">{success}</h2>
          <p className="text-xs cs-text-sub font-mono">Redirecting to your Dashboard...</p>
        </div>
      )}

      {error && (
        <div className="space-y-4 py-6">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-base font-bold font-sans text-white">Verification Failed</h2>
          <p className="text-xs text-rose-300 font-sans">{error}</p>
          <div className="pt-2">
            <Link href="/login" className="bg-[#4DA3FF] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs font-sans inline-block">
              Return to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="font-mono text-xs cs-text-sub">Loading verification...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
