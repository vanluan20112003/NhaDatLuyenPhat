import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingContactGate from '@/components/FloatingContactGate';

// basePath phải ghép tay vào đường dẫn icon: Next không tự thêm cho metadata.icons
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'Nhà Đất Luyện Phát - Mua bán, cho thuê bất động sản',
  description:
    'Nhà Đất Luyện Phát: tin đăng mua bán, cho thuê nhà phố, đất nền, căn hộ. Pháp lý rõ ràng, giá tốt, hỗ trợ tận tình.',
  icons: {
    icon: [
      { url: `${base}/favicon-32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${base}/icon-512.png`, sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: `${base}/apple-touch-icon.png`, sizes: '180x180' }],
  },
};

export const viewport = {
  themeColor: '#0b3a6f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <div className="page">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <FloatingContactGate />
      </body>
    </html>
  );
}
