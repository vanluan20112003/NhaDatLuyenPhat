import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Liên hệ - Nhà Đất Luyện Phát',
  description: 'Gửi yêu cầu tư vấn bất động sản tới Nhà Đất Luyện Phát.',
};

export default function LienHePage() {
  return (
    <div className="container">
      <div className="section-head">
        <h2>Liên hệ với chúng tôi</h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(260px, 1fr)',
          gap: 24,
          paddingBottom: 48,
          alignItems: 'start',
        }}
      >
        <div className="panel">
          <h2>Gửi yêu cầu tư vấn</h2>
          <p style={{ marginTop: 0, color: 'var(--text-dim)', fontSize: 14.5 }}>
            Để lại thông tin, chúng tôi sẽ gọi lại trong thời gian sớm nhất.
          </p>
          <ContactForm />
        </div>

        <div className="panel">
          <h2>Thông tin liên hệ</h2>
          <p style={{ margin: '0 0 10px' }}>
            <strong>Hotline</strong>
            <br />
            <a href="tel:0901234567" style={{ color: 'var(--primary)' }}>
              0901 234 567
            </a>
          </p>
          <p style={{ margin: '0 0 10px' }}>
            <strong>Email</strong>
            <br />
            lienhe@nhadatluyenphat.vn
          </p>
          <p style={{ margin: 0 }}>
            <strong>Giờ làm việc</strong>
            <br />
            Thứ 2 - Thứ 7, 8:00 - 18:00
          </p>
        </div>
      </div>
    </div>
  );
}
