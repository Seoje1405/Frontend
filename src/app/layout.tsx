import { Toaster } from '@/components/ui/sonner';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#005BBF',
};

export const metadata: Metadata = {
  title: { default: 'ongil', template: '%s · ongil' },
  description: '부모님 복약을 함께 챙기는 가장 따뜻한 방법',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ongil',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
