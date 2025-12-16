import Link from 'next/link';

// For now, hardcoded accounts - will fetch from API later
const accounts = [
  { id: 1, slug: 'example1', instagram_username: '@example_account1' },
  { id: 2, slug: 'example2', instagram_username: '@example_account2' },
];

export default function AccountsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Choose an Account</h1>
        <p className="text-center text-gray-600 mb-8">Select an account to submit your content</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <Link
              key={account.id}
              href={`/${account.slug}`}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition text-center"
            >
              <div className="text-3xl mb-4">📱</div>
              <h2 className="text-2xl font-bold mb-2">{account.instagram_username}</h2>
              <p className="text-purple-600 font-semibold">Click to Submit →</p>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

