import Link from 'next/link';
import { asset } from '@/lib/format';
import { PHONE, PHONE_DISPLAY, FACEBOOK, ZALO } from '@/lib/contact';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img
            src={asset('/logo.png')}
            alt="Nhà Đất Luyện Phát"
            width={366}
            height={288}
            className="footer-logo"
          />
          <p className="footer-slogan">
            Uy tín tạo giá trị — Đồng hành cùng phát triển
          </p>
        </div>

        <div className="footer-col">
          <h3>Liên hệ</h3>
          <p>
            <a href={`tel:${PHONE}`}>📞 {PHONE_DISPLAY}</a>
          </p>
          <p>
            <a href={ZALO} target="_blank" rel="noopener noreferrer">
              💬 Chat Zalo
            </a>
          </p>
          <p>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer">
              📘 Facebook
            </a>
          </p>
        </div>

        <div className="footer-col">
          <h3>Liên kết</h3>
          <p>
            <Link href="/">Trang chủ</Link>
          </p>
          <p>
            <Link href="/lien-he/">Gửi yêu cầu tư vấn</Link>
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        © {new Date().getFullYear()} Nhà Đất Luyện Phát. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}
