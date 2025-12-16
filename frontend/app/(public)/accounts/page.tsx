import Link from 'next/link';
import Image from 'next/image';

export default function AccountsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          {/* Tattle News Logo */}
          <div className="mb-8 flex justify-center">
            <Image 
              src="/Tattle News Logo (5).png" 
              alt="Tattle News" 
              width={200} 
              height={200}
              className="w-48 h-auto"
            />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4">Tattle News</h1>
          <p className="text-xl text-gray-400 mb-12">Share your story with our community</p>
          
          <Link
            href="/tattle-news"
            className="inline-block bg-linear-to-r from-[#5ce7ff] to-[#ff1fa9] text-white px-12 py-4 rounded-full text-lg font-bold hover:shadow-[0_0_40px_rgba(92,231,255,0.3)] hover:scale-105 transition-all"
          >
            Submit Your Content
          </Link>
          
          <div className="mt-12">
            <Link href="/" className="text-gray-500 hover:text-gray-300 transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

