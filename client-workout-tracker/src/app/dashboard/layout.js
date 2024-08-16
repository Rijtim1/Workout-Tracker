import React, { Suspense } from 'react';
import Header from '@/components/component/dashboard-header';
import { Sidebar } from '@/components/component/dashboard-sidebar';
import Loading from './loading'; // Import your custom loading component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen w-full bg-muted/40">
          <Sidebar />
          <div className="flex-1 pl-14 sm:pl-60">
            <Header />
            <main className="p-4 sm:p-6">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
