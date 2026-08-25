import Link from 'next/link';
import { asset } from '@/lib/format';
import HeaderNav from './HeaderNav';

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
        <HeaderNav />
      </div>
    </header>
  );
}
