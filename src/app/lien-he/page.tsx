import ContactForm from '@/components/ContactForm';
import { PHONE, PHONE_DISPLAY, FACEBOOK, ZALO, SLOGAN } from '@/lib/contact';

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

      <div className="contact-grid">
        <div className="panel">
          <h2>Gửi yêu cầu tư vấn</h2>
          <p style={{ marginTop: 0, color: 'var(--text-dim)', fontSize: 14.5 }}>
            Để lại số điện thoại, chúng tôi sẽ gọi lại trong thời gian sớm nhất.
          </p>
          <ContactForm />
        </div>

        <div className="panel">
          <h2>Thông tin liên hệ</h2>

          <a href={`tel:${PHONE}`} className="contact-line">
            <span className="cl-ico" aria-hidden="true">
              📞
            </span>
            <span>
              <b>Hotline</b>
              <br />
              {PHONE_DISPLAY}
            </span>
          </a>

          <a
            href={ZALO}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-line"
          >
            <span className="cl-ico" aria-hidden="true">
              💬
            </span>
            <span>
              <b>Zalo</b>
              <br />
              Nhắn tin trực tiếp
            </span>
          </a>

          <a
            href={FACEBOOK}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-line"
          >
            <span className="cl-ico" aria-hidden="true">
              📘
            </span>
            <span>
              <b>Facebook</b>
              <br />
              Nhà Đất Luyện Phát
            </span>
          </a>

          <div className="contact-line" style={{ cursor: 'default' }}>
            <span className="cl-ico" aria-hidden="true">
              🕐
            </span>
            <span>
              <b>Giờ làm việc</b>
              <br />
              Thứ 2 - Chủ nhật, 7:30 - 20:00
            </span>
          </div>

          <p
            style={{
              margin: '18px 0 0',
              paddingTop: 14,
              borderTop: '1px solid var(--border)',
              fontSize: 13.5,
              fontStyle: 'italic',
              color: 'var(--text-dim)',
            }}
          >
            {SLOGAN}
          </p>
        </div>
      </div>
    </div>
  );
}
