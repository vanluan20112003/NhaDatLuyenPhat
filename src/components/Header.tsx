import Link from 'next/link';
import { asset } from '@/lib/format';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container inner">
        <Link href="/" className="logo" aria-label="Nhà Đất Luyện Phát - Trang chủ">
          <img
            src={asset('/logo.png')}
            alt="Nhà Đất Luyện Phát"
            width={366}
            height={288}
          />
        </Link>
        <nav className="nav">
          <Link href="/">Trang chủ</Link>
          <Link href="/lien-he/">Liên hệ</Link>
          <Link href="/admin/" className="cta">
            Quản trị
          </Link>
        </nav>
      </div>
    </header>
  );
}
