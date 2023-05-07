'use client';

import { Montserrat } from 'next/font/google';
import { ReactNode, useEffect } from 'react';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator)
      window.addEventListener('load', () => navigator.serviceWorker.register('/sw.mjs'));
  });

  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
