'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitAccessRequest } from '@/lib/api';

export default function RequestAccessPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitAccessRequest(email, message);
      setSuccess(true);
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
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
          <h1 className="text-2xl font-bold text-white mb-2">Request Access</h1>
          <p className="text-gray-400 mb-6 text-sm">Submit a request to become an admin</p>
          
          {success && (
            <div className="bg-[#5ce7ff]/10 border border-[#5ce7ff]/20 text-[#5ce7ff] px-4 py-3 rounded-lg mb-6 text-sm">
              Request submitted successfully! We'll review it soon.
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:border-[#5ce7ff] focus:ring-1 focus:ring-[#5ce7ff] outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:border-[#5ce7ff] focus:ring-1 focus:ring-[#5ce7ff] outline-none transition resize-none"
                placeholder="Tell us why you need admin access..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5ce7ff] text-black py-3 rounded-lg font-semibold hover:bg-[#4dd4ee] disabled:bg-gray-800 disabled:text-gray-600 transition shadow-lg shadow-[#5ce7ff]/20"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/admin/login" className="text-sm text-gray-400 hover:text-[#5ce7ff] transition">
              Already have access? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

