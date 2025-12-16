import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Open Source News</div>
        <Link
          href="/accounts"
          className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          Book-A-Post
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Open Source News
        </h1>
        <p className="text-2xl mb-4 font-light">
          Community-Powered Content Sharing
        </p>
        <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
          We believe in democratizing news and content creation. Submit your stories, 
          moments, and perspectives to be featured on our Instagram accounts. 
          Everyone has a story worth sharing - let's amplify your voice together.
        </p>
        
        <div className="flex justify-center gap-6 mb-16">
          <Link
            href="/accounts"
            className="bg-white text-purple-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition shadow-2xl transform hover:scale-105"
          >
            Book-A-Post
          </Link>
          <Link
            href="#how-it-works"
            className="border-2 border-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-600 transition"
          >
            Learn More
          </Link>
        </div>

        {/* Features */}
        <div id="how-it-works" className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-white/10 backdrop-blur p-8 rounded-xl">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-3">Submit Your Content</h3>
            <p className="opacity-90">Upload your photos or videos with a caption and we'll review them for publication.</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-8 rounded-xl">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-3">Community Review</h3>
            <p className="opacity-90">Our team reviews submissions to ensure quality and relevance for our audience.</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-8 rounded-xl">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3">Go Live</h3>
            <p className="opacity-90">Approved content gets published to our Instagram accounts, reaching thousands.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-white/20 text-center">
        <div className="space-x-8 text-sm opacity-75">
          <Link href="/terms" className="hover:opacity-100 transition">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:opacity-100 transition">
            Privacy Policy
          </Link>
        </div>
        <p className="mt-4 text-sm opacity-60">
          © 2024 Open Source News. Built with community in mind.
        </p>
      </footer>
    </div>
  );
}

