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
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Link href="/admin" className="block text-center mb-8">
          <span className="text-3xl font-bold text-[#5ce7ff]">Tattle Admin</span>
        </Link>
        
        <div className="bg-[#141414] border border-gray-800 p-8 rounded-xl">
          <h1 className="text-2xl font-bold text-white mb-6">Sign In</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:border-[#5ce7ff] focus:ring-1 focus:ring-[#5ce7ff] outline-none transition"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:border-[#5ce7ff] focus:ring-1 focus:ring-[#5ce7ff] outline-none transition"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5ce7ff] text-black py-3 rounded-lg font-semibold hover:bg-[#4dd4ee] disabled:bg-gray-800 disabled:text-gray-600 transition shadow-lg shadow-[#5ce7ff]/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/admin/request-access" className="text-sm text-gray-400 hover:text-[#5ce7ff] transition">
              Need access? Request here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

