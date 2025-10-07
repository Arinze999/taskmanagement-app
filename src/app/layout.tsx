// import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/redux/ReduxProvider';
import Toaster from '@/components/Toaster';
import { createClient } from '@/utils/supabase/server';
import HydrateAuth from '@/components/HydrateAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const inter = Inter({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-inter',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const safeUser = {
    id: data.user?.id ?? null,
    email: data.user?.email ?? null,
  };

  console.log(safeUser);

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased bg-dark`}
      >
        <div id="modal-root"></div>
        <ReduxProvider>
          <HydrateAuth user={safeUser} />
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
