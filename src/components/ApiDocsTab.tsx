import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Code, Copy, Check, Terminal, Globe, Key } from 'lucide-react';

export const ApiDocsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const mockApiKey = `ig_live_${currentUser?.uid ? currentUser.uid.slice(-10) : 'a98f12k84e'}`;
  const apiUrl = `${window.location.origin}/api/v2`;

  const copyToClipboard = (text: string, type: 'key' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedEndpoint(true);
      setTimeout(() => setCopiedEndpoint(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white">Instagram Growth Reseller API v2</h2>
        <p className="text-xs text-zinc-400">Automate Instagram order placement and balance queries</p>
      </div>

      {/* API Key Box */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-rose-400" />
              <span>Your Personal API Key</span>
            </span>
            <p className="font-mono text-sm font-bold text-rose-300 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 inline-block">
              {mockApiKey}
            </p>
          </div>

          <button
            onClick={() => copyToClipboard(mockApiKey, 'key')}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800">
          <div>
            <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>API Gateway Endpoint</span>
            </span>
            <p className="font-mono text-xs text-zinc-300 mt-0.5">{apiUrl}</p>
          </div>

          <button
            onClick={() => copyToClipboard(apiUrl, 'url')}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
          >
            {copiedEndpoint ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEndpoint ? 'Copied' : 'Copy URL'}</span>
          </button>
        </div>
      </div>

      {/* Endpoints Documentation */}
      <div className="space-y-4">
        {/* Endpoint 1: Services List */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-wider">
              POST
            </span>
            <span className="font-mono text-xs text-white font-bold">action=services</span>
          </div>
          <p className="text-xs text-zinc-400">Returns list of all available Instagram services, rates, and limits.</p>

          <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
            <span className="text-zinc-500">// Request Payload</span><br />
            {JSON.stringify({ key: mockApiKey, action: "services" }, null, 2)}
          </div>
        </div>

        {/* Endpoint 2: Add Order */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-wider">
              POST
            </span>
            <span className="font-mono text-xs text-white font-bold">action=add</span>
          </div>
          <p className="text-xs text-zinc-400">Place a new order for followers, likes, reels, or comments.</p>

          <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
            <span className="text-zinc-500">// Request Payload</span><br />
            {JSON.stringify({
              key: mockApiKey,
              action: "add",
              service: "ig-fol-hq",
              link: "@mike_visuals",
              quantity: 1000
            }, null, 2)}
          </div>
        </div>
      </div>
    </div>
  );
};
