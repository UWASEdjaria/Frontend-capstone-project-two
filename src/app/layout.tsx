import './globals.css';
import { Providers } from './providers';
import Header from '../components/Header';

export const metadata = {
  title: 'Djaria Medium Clone',
  description: 'A Medium-style blog platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black font-sans">
        <Providers>
          <Header />
          <main className="flex-1 flex flex-col min-h-screen bg-gray-900">{children}</main>
        </Providers>

        <footer className="bg-white text-center py-4 border-t border-transparent text-black font-sans">
          &copy; {new Date().getFullYear()} Medium. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
