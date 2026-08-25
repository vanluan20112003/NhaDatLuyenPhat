import { asset } from '@/lib/format';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <img
          src={asset('/logo.png')}
          alt="Nhà Đất Luyện Phát"
          width={366}
          height={288}
          className="footer-logo"
        />
        <div>
          <div style={{ fontStyle: 'italic', marginBottom: 6 }}>
            Uy tín tạo giá trị — Đồng hành cùng phát triển
          </div>
          Hotline: 0901 234 567 · Email: lienhe@nhadatluyenphat.vn
          <br />
          <span style={{ fontSize: 13, opacity: 0.75 }}>
            © {new Date().getFullYear()} Nhà Đất Luyện Phát. Bảo lưu mọi quyền.
          </span>
        </div>
      </div>
    </footer>
  );
}
