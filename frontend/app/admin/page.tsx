import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold mb-4 text-white">Admin Portal</h1>
        <p className="text-gray-400 mb-12">Manage submissions and content</p>
        <div className="space-y-4">
          <Link
            href="/admin/login"
            className="block bg-[#5ce7ff] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#4dd4ee] transition shadow-lg shadow-[#5ce7ff]/20"
          >
            Sign In
          </Link>
          <Link
            href="/admin/request-access"
            className="block bg-[#1a1a1a] border border-gray-800 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-[#222] hover:border-gray-700 transition"
          >
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}

