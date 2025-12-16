import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose">
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By submitting content to this platform, you agree to these terms of service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Content Rights</h2>
          <p className="mb-4">
            You grant us permission to use, modify, and publish your submitted content on our Instagram accounts.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Content Guidelines</h2>
          <p className="mb-4">
            All submitted content must be appropriate, original, and comply with Instagram's community guidelines.
          </p>
        </div>
        
        <div className="mt-8">
          <Link href="/" className="text-purple-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

