'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { handleLogin } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await handleLogin(username, password);
      router.push('/admin/dashboard/pending');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5ce7ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff1fa9] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/admin" className="inline-block mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] bg-clip-text text-transparent">
              Admin Portal
            </h1>
          </Link>
          <p className="text-gray-400">Sign in to access your dashboard</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#5ce7ff] focus:ring-2 focus:ring-[#5ce7ff]/20 outline-none transition"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#5ce7ff] focus:ring-2 focus:ring-[#5ce7ff]/20 outline-none transition"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] text-black py-3.5 rounded-xl font-bold hover:shadow-[0_0_40px_rgba(92,231,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="relative z-10">{loading ? 'Signing in...' : 'Sign In'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#4dd4ee] to-[#ff1fa9] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link href="/admin/request-access" className="text-sm text-gray-400 hover:text-[#5ce7ff] transition inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Need access? Request here
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5ce7ff] transition text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

