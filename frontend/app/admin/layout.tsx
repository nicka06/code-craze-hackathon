import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="text-2xl font-bold text-purple-600">
              Tattle Admin
            </Link>
            <div className="space-x-4">
              <Link href="/admin/dashboard/pending" className="text-gray-700 hover:text-purple-600">
                Dashboard
              </Link>
              <Link href="/" className="text-gray-700 hover:text-purple-600">
                Public Site
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

