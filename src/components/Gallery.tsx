'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Gallery ảnh tin đăng: ảnh lớn + mũi tên trái/phải + dải thumbnail.
 * Bấm vào ảnh lớn thì mở lightbox phóng to giữa màn hình.
 * Ảnh đầu tiên (index 0) cũng là ảnh bìa hiển thị ngoài trang chủ.
 */
export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const total = images.length;

  // Quay vòng: từ ảnh cuối bấm tiếp thì về ảnh đầu
  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + total) % total),
    [total]
  );

  // Phím mũi tên chuyển ảnh, Esc đóng lightbox
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setZoomed(false);
      else if (total > 1 && e.key === 'ArrowLeft') go(-1);
      else if (total > 1 && e.key === 'ArrowRight') go(1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, total]);

  // Mở lightbox thì khóa cuộn trang nền
  useEffect(() => {
    if (!zoomed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [zoomed]);

  if (total === 0) {
    return (
      <div className="gallery-main">
        <div className="gallery-empty">Chưa có ảnh</div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery-main">
        <img
          src={images[index]}
          alt={`${alt} - ảnh ${index + 1}`}
          className="gal-img"
          onClick={() => setZoomed(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setZoomed(true);
            }
          }}
          aria-label="Phóng to ảnh"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              className="gal-nav gal-prev"
              onClick={() => go(-1)}
              aria-label="Ảnh trước"
            >
              <Chevron dir="left" />
            </button>

            <button
              type="button"
              className="gal-nav gal-next"
              onClick={() => go(1)}
              aria-label="Ảnh kế tiếp"
            >
              <Chevron dir="right" />
            </button>
          </>
        )}

        <span className="gal-count">
          {index + 1} / {total}
        </span>
      </div>

      {total > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={i === index ? 'active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} - ảnh ${index + 1} trên ${total}`}
          // Bấm ra nền tối thì đóng; bấm lên ảnh thì không
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            className="lb-close"
            onClick={() => setZoomed(false)}
            aria-label="Đóng"
          >
            ✕
          </button>

          <img
            src={images[index]}
            alt={`${alt} - ảnh ${index + 1}`}
            className="lb-img"
            onClick={(e) => e.stopPropagation()}
          />

          {total > 1 && (
            <>
              <button
                type="button"
                className="gal-nav lb-nav gal-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Ảnh trước"
              >
                <Chevron dir="left" />
              </button>

              <button
                type="button"
                className="gal-nav lb-nav gal-next"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Ảnh kế tiếp"
              >
                <Chevron dir="right" />
              </button>
            </>
          )}

          <span className="lb-count">
            {index + 1} / {total}
          </span>
        </div>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={dir === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  );
}
