import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="text-center text-white p-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to Tattle News</h1>
        <p className="text-xl mb-8">Submit your content to be featured on Instagram</p>
        
        <div className="space-x-4">
          <Link
            href="/accounts"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            View Accounts
          </Link>
        </div>
        
        <div className="mt-12 space-x-6 text-sm">
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

