import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  Server, 
  ShieldCheck, 
  Terminal, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  Key
} from 'lucide-react';
import { 
  SUPABASE_SQL_SCHEMA, 
  isSupabaseConfigured,
  DEFAULT_SUPABASE_PROJECT_ID,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  syncAllCatalogToSupabase
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [copied, setCopied] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const isConnected = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSyncAllCatalog = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await syncAllCatalogToSupabase();
      if (res.success) {
        setSeedResult(`Successfully uploaded all ${res.count} items (12 Destinations, 10 Packages, 8 Hotels) directly to your Supabase tables!`);
        onRefreshData();
      } else {
        setSeedResult(`Sync note: ${res.error}. Make sure you have created the tables in Supabase SQL editor first.`);
      }
    } catch (err: any) {
      setSeedResult(`Sync error: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl ${isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  {isConnected ? 'Supabase Backend Connected' : 'Local-First Mode (Offline Resilient)'}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isConnected ? 'Live Cloud DB' : 'Local Mode Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isConnected 
                  ? <>Project ID: <span className="font-mono font-bold text-slate-700">{DEFAULT_SUPABASE_PROJECT_ID}</span></>
                  : 'Fast client-side persistence with zero network delays or failures'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Connection Status Card */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isConnected 
              ? 'bg-gradient-to-r from-emerald-50/60 to-teal-50/40 border-emerald-200/70' 
              : 'bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border-blue-200/70'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
              }`} />
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {isConnected ? 'Supabase Live Instance Connected' : 'Local Database Running (Like Before)'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {isConnected 
                    ? <>Connected to <strong className="font-mono text-emerald-950">{SUPABASE_URL}</strong> using your publishable credentials.</>
                    : 'The app is running in resilient local mode. All destinations, packages, hotels, reviews, and bookings are 100% operational with instant response.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isConnected ? (
                <>
                  <button
                    onClick={() => onRefreshData()}
                    className="px-3 py-1.5 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('travelora_custom_supabase_url');
                      localStorage.removeItem('travelora_custom_supabase_key');
                      window.location.reload();
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    title="Disconnect and use local storage like before"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    localStorage.setItem('travelora_custom_supabase_url', DEFAULT_SUPABASE_URL);
                    localStorage.setItem('travelora_custom_supabase_key', DEFAULT_SUPABASE_ANON_KEY);
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm cursor-pointer transition-colors"
                >
                  Connect Supabase
                </button>
              )}
            </div>
          </div>

          {/* Credentials Summary Box */}
          {isConnected && (
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-blue-600" />
                  <span>Project URL:</span>
                </span>
                <span className="font-mono font-bold text-slate-800 truncate max-w-[280px]">{SUPABASE_URL}</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                <span className="font-bold text-slate-500 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Publishable Key:</span>
                </span>
                <span className="font-mono text-[11px] text-slate-700 truncate max-w-[280px]">
                  {SUPABASE_ANON_KEY.substring(0, 16)}...{SUPABASE_ANON_KEY.slice(-6)}
                </span>
              </div>
            </div>
          )}

          {/* Sync All Catalog to Supabase */}
          {isConnected && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Upload All 12 Destinations, Packages & Hotels</span>
                </h5>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Push Kashmir, Goa, Kerala, Rajasthan, and all tour packages and hotels directly to your Supabase tables.
                </p>
                {seedResult && (
                  <p className="text-[11px] font-bold text-emerald-900 mt-1.5 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
                    {seedResult}
                  </p>
                )}
              </div>
              <button
                onClick={handleSyncAllCatalog}
                disabled={isSeeding}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-black shrink-0 shadow-xs cursor-pointer transition-colors"
              >
                {isSeeding ? 'Uploading...' : 'Upload All to Supabase'}
              </button>
            </div>
          )}

          {/* Database Entities Summary */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2">
              Integrated Travel Tables
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-mono font-bold text-blue-600 block">destinations</span>
                <span className="text-[11px] text-slate-500">Tourist cities, coordinates, rates, and galleries</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-mono font-bold text-emerald-600 block">packages</span>
                <span className="text-[11px] text-slate-500">Curated tour packages, itineraries & inclusions</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-mono font-bold text-purple-600 block">hotels</span>
                <span className="text-[11px] text-slate-500">Luxury resorts, nightly pricing in INR & rooms left</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-mono font-bold text-amber-600 block">bookings</span>
                <span className="text-[11px] text-slate-500">Reservations, traveler info, guests & payment status</span>
              </div>
            </div>
          </div>

          {/* SQL Setup Script for Supabase Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span>PostgreSQL Migration Script (Tables &amp; RLS)</span>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`https://supabase.com/dashboard/project/${DEFAULT_SUPABASE_PROJECT_ID}/sql/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Open SQL Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied SQL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Schema</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed border border-slate-800">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
            <p className="text-[11px] text-slate-500">
              Run this in your Supabase Dashboard &gt; SQL Editor to generate the schema with automated Row Level Security (RLS) policies.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
