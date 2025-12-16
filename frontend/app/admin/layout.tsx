'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { handleLogout } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === '/admin' || pathname === '/admin/login' || pathname === '/admin/request-access';

  const logout = async () => {
    await handleLogout();
    router.push('/admin/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a]">
        {!isAuthPage && (
          <nav className="bg-[#141414] border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <Link href="/admin/dashboard/pending" className="text-2xl font-bold text-[#5ce7ff] hover:text-[#4dd4ee] transition">
                  Tattle Admin
                </Link>
                <div className="flex items-center gap-6">
                  <Link 
                    href="/admin/dashboard/pending" 
                    className={`text-sm font-medium transition ${
                      pathname === '/admin/dashboard/pending' 
                        ? 'text-[#5ce7ff]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Pending
                  </Link>
                  <Link 
                    href="/admin/dashboard/history" 
                    className={`text-sm font-medium transition ${
                      pathname === '/admin/dashboard/history' 
                        ? 'text-[#5ce7ff]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    History
                  </Link>
                  <Link 
                    href="/" 
                    className="text-sm font-medium text-gray-400 hover:text-white transition"
                  >
                    Public Site
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-gray-400 hover:text-red-400 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}

