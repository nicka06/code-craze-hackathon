import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Admin Portal</h1>
          <p className="text-gray-400">Manage submissions and content</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/admin/login"
            className="block w-full bg-gradient-to-r from-[#5ce7ff] to-[#ff1fa9] text-black py-4 px-6 rounded-xl font-bold text-center hover:shadow-lg hover:shadow-[#5ce7ff]/30 transition-all"
          >
            Sign In
          </Link>
          
          <Link
            href="/admin/request-access"
            className="block w-full bg-[#1a1a1a] border border-white/10 text-white py-4 px-6 rounded-xl font-semibold text-center hover:bg-[#222] hover:border-white/20 transition"
          >
            Request Access
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-500 hover:text-[#5ce7ff] transition text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

