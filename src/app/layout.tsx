import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Nhà Đất Luyện Phát - Mua bán, cho thuê bất động sản',
  description:
    'Nhà Đất Luyện Phát: tin đăng mua bán, cho thuê nhà phố, đất nền, căn hộ. Pháp lý rõ ràng, giá tốt, hỗ trợ tận tình.',
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
      </body>
    </html>
  );
}
