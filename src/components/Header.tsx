import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container inner">
        <Link href="/" className="logo">
          Nhà Đất <span>Luyện Phát</span>
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
