import { AuthProvider } from './context/AuthContext';
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Djaria Medium Clone',
  description: 'A Medium-style blog platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <header className="bg-white shadow-md p-4 border-b border-gray-200">
          <nav className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-2xl text-orange-500">
              DjariaBlog
            </Link>
            <div className="flex gap-4">
              <Link href="/lab2/login" className="text-orange-500 hover:underline">
                Login
              </Link>
              <Link href="/lab2/signup" className="text-orange-500 hover:underline">
                Signup
              </Link>
            </div>
          </nav>
        </header>
          <AuthProvider>
        <main className="flex-1  flex flex-col min-h-screen bg-white">{children}</main>
         </AuthProvider>

        <footer className="bg-white text-center py-4  border-t border-gray-200 text-red-500">
          &copy; {new Date().getFullYear()} DjariaBlog. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
