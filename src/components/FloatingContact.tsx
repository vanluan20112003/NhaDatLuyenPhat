const PHONE = '0354434852';
const PHONE_DISPLAY = '0354 434 852';
const FACEBOOK = 'https://www.facebook.com/profile.php?id=61587618237744';
const ZALO = `https://zalo.me/${PHONE}`;

/**
 * Cụm nút liên hệ nổi góc phải, kiểu thường thấy trên web thương mại.
 * Chỉ hiện ở các trang quảng bá — không gắn vào /admin.
 */
export default function FloatingContact() {
  return (
    <div className="float-contact">
      <a
        href={`tel:${PHONE}`}
        className="fc-btn fc-phone"
        aria-label={`Gọi ${PHONE_DISPLAY}`}
      >
        <span className="fc-ico" aria-hidden="true">
          {/* Ống nghe điện thoại */}
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z" />
          </svg>
        </span>
        <span className="fc-label">{PHONE_DISPLAY}</span>
      </a>

      <a
        href={ZALO}
        target="_blank"
        rel="noopener noreferrer"
        className="fc-btn fc-zalo"
        aria-label="Nhắn tin Zalo"
      >
        <span className="fc-ico" aria-hidden="true">
          <strong style={{ fontSize: 13, letterSpacing: '-0.3px' }}>Zalo</strong>
        </span>
        <span className="fc-label">Chat Zalo</span>
      </a>

      <a
        href={FACEBOOK}
        target="_blank"
        rel="noopener noreferrer"
        className="fc-btn fc-fb"
        aria-label="Xem trang Facebook"
      >
        <span className="fc-ico" aria-hidden="true">
          {/* Chữ f Facebook */}
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.33-.04-1.55-.14-2.84-.14C11.96 2 10 3.66 10 6.7v2.8H7v4h3V22h4v-8.5z" />
          </svg>
        </span>
        <span className="fc-label">Facebook</span>
      </a>
    </div>
  );
}
