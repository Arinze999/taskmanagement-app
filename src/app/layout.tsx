import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://taskmanagement-app-vert.vercel.app/'),
  title: { default: 'Task Manager', template: '%s · Task Manager' },
  description:
    'A simple per-user task manager built with Next.js + Supabase. Made by Arinze.',
  openGraph: {
    type: 'website',
    title: 'Task Manager – Made by Arinze',
    description:
      'Create, edit, and delete your tasks. Private by design with Supabase Auth.',
    url: 'https://taskmanagement-app-vert.vercel.app/',
    siteName: 'Task Manager',
    images: [
      'https://static.vecteezy.com/system/resources/previews/000/963/090/non_2x/cartoon-man-with-to-do-list-on-clipboard-vector.jpg',
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Manager – Made by Arinze',
    description:
      'Create, edit, and delete your tasks. Private by design with Supabase Auth.',
    images: [
      'https://static.vecteezy.com/system/resources/previews/000/963/090/non_2x/cartoon-man-with-to-do-list-on-clipboard-vector.jpg',
    ],
  },
};

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
