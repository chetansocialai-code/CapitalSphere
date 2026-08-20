'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Key, Plus, Trash2, Copy, Check, Terminal, ShieldCheck, Code, BookOpen, ExternalLink, Zap } from 'lucide-react';

export default function DevelopersPage() {
  const [user, setUser] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyName, setKeyName] = useState('');
  const [newGeneratedKey, setNewGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'javascript' | 'python'>('curl');

  useEffect(() => {
    const token = localStorage.getItem('cs_token');
    const userJson = localStorage.getItem('cs_user');

    if (token && userJson) {
      try {
        setUser(JSON.parse(userJson));
      } catch (e) {}
    }

    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    const token = localStorage.getItem('cs_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/developer/keys`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setApiKeys(json.data);
      }
    } catch (err) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('cs_token');
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/developer/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: keyName || 'My Algorithmic Trading API Key' })
      });

      const json = await res.json();
      if (json.success && json.apiKey) {
        setNewGeneratedKey(json.apiKey);
        setKeyName('');
        fetchKeys();
      }
    } catch (err) {
      // Ignore
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    const token = localStorage.getItem('cs_token');
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${apiUrl}/api/v1/developer/keys/${keyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchKeys();
    } catch (err) {
      // Ignore
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const activeKeySample = newGeneratedKey || (apiKeys[0]?.keyPrefix || 'cs_live_sample_key_998877');

  return (
    <div className="max-w-master mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="cs-card border rounded-2xl p-8 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4DA3FF] uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-[#4DA3FF]" /> CAPITALSPHERE DEVELOPER PLATFORM & OPEN API
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-sans text-white">
          Build Algorithmic Apps with <span className="text-[#4DA3FF]">CapitalSphere Open API</span>
        </h1>
        <p className="text-xs md:text-sm cs-text-sub font-sans max-w-2xl leading-relaxed">
          Programmatically access live Upstox market quotes, Indian & Global indices, Options Chain matrix, business news streams, and AI market intelligence.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-2xs font-mono">
          <span className="bg-[#22C58B]/10 text-[#22C58B] border border-[#22C58B]/30 px-3 py-1 rounded-full font-bold uppercase flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> API STATUS: ONLINE
          </span>
          <span className="cs-topbar border cs-border px-3 py-1 rounded-full font-bold cs-text-sub">
            RATE LIMIT: 1,000 REQ / MIN
          </span>
          <span className="cs-topbar border cs-border px-3 py-1 rounded-full font-bold cs-text-sub">
            PROTOCOL: REST & WEBSOCKET
          </span>
        </div>
      </div>

      {/* Grid: Key Generator + API Keys List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: API Key Generator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="cs-card border rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-sm font-bold font-mono text-white border-b cs-border pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#4DA3FF]" /> Generate CapitalSphere Production API Key
            </h2>

            {!user ? (
              <div className="text-center py-6 space-y-3 font-mono text-xs cs-text-sub">
                <p>Please sign in to generate and manage your CapitalSphere API keys.</p>
                <Link href="/login?redirect=/developers" className="bg-[#4DA3FF] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs font-sans inline-block">
                  Sign In to Developer Portal
                </Link>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold cs-text-sub">API Key Identifier / Name</label>
                  <input
                    type="text"
                    required
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g. My Quant Bot Key"
                    className="w-full cs-card text-xs px-4 py-2.5 rounded-xl border focus:border-[#4DA3FF] focus:outline-none transition font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#4DA3FF] hover:bg-[#69B2FF] text-slate-950 font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-wider"
                >
                  <Key className="w-4 h-4" /> Create CapitalSphere API Key
                </button>
              </form>
            )}

            {newGeneratedKey && (
              <div className="cs-topbar border border-[#22C58B]/40 p-4 rounded-xl space-y-2">
                <div className="text-xs font-mono font-bold text-[#22C58B] flex items-center justify-between">
                  <span>API KEY GENERATED SUCCESSFULLY!</span>
                  <button
                    onClick={() => copyToClipboard(newGeneratedKey)}
                    className="hover:text-white transition flex items-center gap-1 text-3xs uppercase"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-[#22C58B]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey ? 'Copied' : 'Copy Key'}
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-700 text-xs font-mono text-[#4DA3FF] break-all">
                  {newGeneratedKey}
                </div>
                <p className="text-3xs cs-text-sub font-sans">
                  Save this key now. For security, raw keys are never shown again after closing this session.
                </p>
              </div>
            )}
          </div>

          {/* Active Keys List */}
          <div className="cs-card border rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-sm font-bold font-mono text-white border-b cs-border pb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#F2B84B]" /> Active Production API Keys ({apiKeys.length})
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {apiKeys.map((keyObj) => (
                <div key={keyObj.id} className="cs-topbar border cs-border p-3.5 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-white text-xs">{keyObj.name}</div>
                    <div className="text-3xs cs-text-sub">{keyObj.keyPrefix}</div>
                    <div className="text-3xs text-slate-500">Created: {new Date(keyObj.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => handleRevokeKey(keyObj.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Revoke API Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive API Documentation & Code Snippets */}
        <div className="lg:col-span-7 space-y-6">
          <div className="cs-card border rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b cs-border pb-3">
              <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-[#22C58B]" /> CapitalSphere Open API Code Integration
              </h2>

              <div className="flex items-center gap-1 cs-topbar p-1 rounded-lg border cs-border font-mono text-3xs font-bold">
                <button
                  onClick={() => setActiveCodeTab('curl')}
                  className={`px-3 py-1 rounded transition ${activeCodeTab === 'curl' ? 'bg-[#4DA3FF] text-slate-950 font-bold' : 'cs-text-sub'}`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveCodeTab('javascript')}
                  className={`px-3 py-1 rounded transition ${activeCodeTab === 'javascript' ? 'bg-[#4DA3FF] text-slate-950 font-bold' : 'cs-text-sub'}`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setActiveCodeTab('python')}
                  className={`px-3 py-1 rounded transition ${activeCodeTab === 'python' ? 'bg-[#4DA3FF] text-slate-950 font-bold' : 'cs-text-sub'}`}
                >
                  Python
                </button>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed">
              {activeCodeTab === 'curl' && (
                <pre>{`# 1. Fetch Real-Time Market Quotes
curl -X GET "https://www.capitalsphere.online/api/v1/public/markets/quotes" \\
  -H "X-CAPITALSPHERE-API-KEY: ${activeKeySample}"

# 2. Fetch Derivatives & Option Chain Matrix
curl -X GET "https://www.capitalsphere.online/api/v1/public/options/NIFTY" \\
  -H "X-CAPITALSPHERE-API-KEY: ${activeKeySample}"

# 3. Fetch AI Market Intelligence Brief
curl -X GET "https://www.capitalsphere.online/api/v1/public/ai/intelligence" \\
  -H "X-CAPITALSPHERE-API-KEY: ${activeKeySample}"`}</pre>
              )}

              {activeCodeTab === 'javascript' && (
                <pre>{`// Fetch Live Quotes with CapitalSphere Node.js / Browser API
const apiKey = '${activeKeySample}';

async function getLiveQuotes() {
  const res = await fetch('https://www.capitalsphere.online/api/v1/public/markets/quotes', {
    headers: {
      'X-CAPITALSPHERE-API-KEY': apiKey
    }
  });
  const data = await res.json();
  console.log('CapitalSphere Quotes:', data);
}

getLiveQuotes();`}</pre>
              )}

              {activeCodeTab === 'python' && (
                <pre>{`import requests

api_key = '${activeKeySample}'
url = 'https://www.capitalsphere.online/api/v1/public/markets/quotes'

headers = {
    'X-CAPITALSPHERE-API-KEY': api_key
}

response = requests.get(url, headers=headers)
print(response.json())`}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
