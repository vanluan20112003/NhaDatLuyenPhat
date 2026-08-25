export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <strong>Nhà Đất Luyện Phát</strong> — Mua bán, cho thuê bất động sản.
        <br />
        Hotline: 0901 234 567 · Email: lienhe@nhadatluyenphat.vn
        <br />
        <span style={{ fontSize: 13, opacity: 0.75 }}>
          © {new Date().getFullYear()} Nhà Đất Luyện Phát. Bảo lưu mọi quyền.
        </span>
      </div>
    </footer>
  );
}
