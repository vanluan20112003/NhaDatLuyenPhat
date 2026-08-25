'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Gallery ảnh tin đăng: ảnh lớn + mũi tên trái/phải + dải thumbnail.
 * Ảnh đầu tiên (index 0) cũng là ảnh bìa hiển thị ngoài trang chủ.
 */
export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  // Quay vòng: từ ảnh cuối bấm tiếp thì về ảnh đầu
  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + total) % total),
    [total]
  );

  // Điều hướng bằng phím mũi tên
  useEffect(() => {
    if (total < 2) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, total]);

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
        <img src={images[index]} alt={`${alt} - ảnh ${index + 1}`} />

        {total > 1 && (
          <>
            <button
              type="button"
              className="gal-nav gal-prev"
              onClick={() => go(-1)}
              aria-label="Ảnh trước"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              className="gal-nav gal-next"
              onClick={() => go(1)}
              aria-label="Ảnh kế tiếp"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <span className="gal-count">
              {index + 1} / {total}
            </span>
          </>
        )}
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
    </div>
  );
}
