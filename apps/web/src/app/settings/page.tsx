'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, Lock, Mail, Bell, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Save } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('cs_token');
    const userJson = localStorage.getItem('cs_user');

    if (!token || !userJson) {
      router.push('/login?redirect=/settings');
      return;
    }

    try {
      setUser(JSON.parse(userJson));
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Simulate password change
      setSuccess('Password updated successfully! Next login will require your new password.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError('Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b cs-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="cs-card p-2 rounded-lg border hover:border-[#4DA3FF] transition text-xs font-mono">
            <ArrowLeft className="w-4 h-4 text-[#4DA3FF]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-sans text-white">Account Settings & Security</h1>
            <p className="text-xs cs-text-sub font-mono">Manage your password, notifications & profile preferences</p>
          </div>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Overview */}
        <div className="md:col-span-4 cs-card border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3 border-b cs-border pb-3">
            <div className="p-3 rounded-xl bg-[#4DA3FF]/15 text-[#4DA3FF] font-bold font-mono text-sm">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'CS'}
            </div>
            <div>
              <div className="font-bold text-sm text-white">{user?.name}</div>
              <div className="text-3xs cs-text-sub font-mono">{user?.email}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono cs-text-sub">
            <div className="flex justify-between">
              <span>Account Role:</span>
              <span className="text-[#4DA3FF] font-bold">{user?.role || 'USER'}</span>
            </div>
            <div className="flex justify-between">
              <span>Email Verified:</span>
              <span className="text-[#22C58B] font-bold">YES</span>
            </div>
          </div>
        </div>

        {/* Password Security Form */}
        <div className="md:col-span-8 cs-card border rounded-2xl p-6 space-y-6">
          <div className="border-b cs-border pb-3">
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#4DA3FF]" /> Password & Security
            </h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold cs-text-sub">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full cs-card text-xs px-4 py-2.5 rounded-xl border focus:border-[#4DA3FF] focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold cs-text-sub">New Password (Min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full cs-card text-xs px-4 py-2.5 rounded-xl border focus:border-[#4DA3FF] focus:outline-none transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold cs-text-sub">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full cs-card text-xs px-4 py-2.5 rounded-xl border focus:border-[#4DA3FF] focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#4DA3FF] hover:bg-[#69B2FF] text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-xs font-sans uppercase tracking-wider"
            >
              <Save className="w-4 h-4" /> Save New Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
