'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

// Account data - in the future this will come from API
const accounts = [
  {
    id: 1,
    slug: 'tattle-news',
    name: 'Tattle News',
    username: 'tattle_news',
    description: 'Share your stories and perspectives with our community',
    logo: '/Tattle News Logo (5).png',
    color: 'from-[#5ce7ff] to-[#ff1fa9]',
  },
  // More accounts can be added here
];

export default function AccountsPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-400 hover:text-[#5ce7ff] transition group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] bg-clip-text text-transparent">
            Open Source News
          </h1>
          <div className="w-32"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#5ce7ff] via-white to-[#ff1fa9] bg-clip-text text-transparent">
            Choose an Account
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select an account to submit your content. Each account has its own community and focus.
          </p>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accounts.map((account) => (
            <Link
              key={account.id}
              href={`/${account.slug}`}
              onMouseEnter={() => setHoveredId(account.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative bg-[#111111] border border-white/10 rounded-2xl p-8 hover:border-[#5ce7ff]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(92,231,255,0.2)] hover:scale-[1.02]"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${account.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="mb-6 flex justify-center">
                  <div className="relative w-24 h-24 rounded-full bg-black/50 p-3 border border-white/10 group-hover:border-[#5ce7ff]/30 transition-colors">
                    <Image 
                      src={account.logo} 
                      alt={account.name} 
                      width={80} 
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                {/* Account Name */}
                <h3 className="text-2xl font-bold text-center mb-2 group-hover:text-[#5ce7ff] transition-colors">
                  {account.name}
                </h3>
                
                {/* Username */}
                <p className="text-center text-gray-400 mb-4 text-sm">
                  @{account.username}
                </p>
                
                {/* Description */}
                <p className="text-center text-gray-500 mb-6 text-sm leading-relaxed">
                  {account.description}
                </p>
                
                {/* CTA Button */}
                <div className={`w-full bg-gradient-to-r ${account.color} text-white py-3 rounded-lg font-semibold text-center group-hover:shadow-lg group-hover:shadow-[#5ce7ff]/30 transition-all`}>
                  Submit Content
                </div>
              </div>

              {/* Hover indicator */}
              {hoveredId === account.id && (
                <div className="absolute top-4 right-4">
                  <svg className="w-6 h-6 text-[#5ce7ff] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Empty state message if no accounts */}
        {accounts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No accounts available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}

