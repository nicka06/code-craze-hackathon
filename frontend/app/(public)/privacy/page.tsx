import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose">
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
          <p className="mb-4">
            We collect your email address and the content you submit for publication.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
          <p className="mb-4">
            Your email is used solely to notify you about the status of your submission.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Security</h2>
          <p className="mb-4">
            We implement security measures to protect your personal information.
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

