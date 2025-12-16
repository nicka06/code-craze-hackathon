import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Admin Portal</h1>
        <div className="space-x-4">
          <Link
            href="/admin/login"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Login
          </Link>
          <Link
            href="/admin/request-access"
            className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}

