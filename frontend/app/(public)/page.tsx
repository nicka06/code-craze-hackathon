import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-semibold">Open Source News</div>
        <Link
          href="/accounts"
          className="bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition"
        >
          Book-A-Post
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Community-Powered Content
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10">
            Submit your stories and perspectives to be featured on our Instagram accounts.
          </p>
          <Link
            href="/accounts"
            className="inline-block bg-white text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-6 border-t border-gray-800 text-center text-sm text-gray-500">
        © 2024 Open Source News
      </footer>
    </div>
  );
}

