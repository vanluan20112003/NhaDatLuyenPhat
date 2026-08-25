'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/lib/types';
import { PROPERTY_TYPE_LABEL, STATUS_LABEL } from '@/lib/types';
import { displayPrice, formatArea, formatDate } from '@/lib/format';
import ContactForm from '@/components/ContactForm';

function PropertyDetail() {
  const id = useSearchParams().get('id');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) {
      setError('Thiếu mã tin đăng.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (cancelled) return;
      if (error) setError(error.message);
      else if (!data) setError('Không tìm thấy tin đăng này.');
      else setProperty(data as Property);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="spinner" />;

  if (error || !property) {
    return (
      <div className="container" style={{ padding: '48px 16px' }}>
        <div className="empty">
          {error ?? 'Không tìm thấy tin đăng.'}
          <div style={{ marginTop: 16 }}>
            <Link href="/" className="btn">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const p = property;
  const images = p.images ?? [];
  const fullAddress = [p.address, p.district, p.province].filter(Boolean).join(', ');

  return (
    <div className="container">
      <div style={{ padding: '16px 0 0', fontSize: 14, color: 'var(--text-dim)' }}>
        <Link href="/" style={{ color: 'var(--primary)' }}>
          Trang chủ
        </Link>
        {' / '}
        {PROPERTY_TYPE_LABEL[p.property_type]}
      </div>

      <div className="detail-grid">
        <div>
          <div className="gallery-main">
            {images.length > 0 ? (
              <img src={images[activeImg]} alt={p.title} />
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9aa3b0',
                }}
              >
                Chưa có ảnh
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  className={i === activeImg ? 'active' : ''}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Ảnh ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}

          <div className="panel" style={{ marginTop: 18 }}>
            <h1 style={{ margin: '0 0 10px', fontSize: 23, letterSpacing: '-0.4px' }}>
              {p.title}
            </h1>
            {fullAddress && (
              <div style={{ color: 'var(--text-dim)', marginBottom: 12 }}>
                📍 {fullAddress}
              </div>
            )}
            <div className="price-big">{displayPrice(p)}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 4 }}>
              Đăng ngày {formatDate(p.created_at)}
            </div>
          </div>

          <div className="panel">
            <h2>Thông tin chi tiết</h2>
            <dl className="spec-list">
              <div>
                <dt>Loại hình</dt>
                <dd>{PROPERTY_TYPE_LABEL[p.property_type]}</dd>
              </div>
              <div>
                <dt>Nhu cầu</dt>
                <dd>{STATUS_LABEL[p.status]}</dd>
              </div>
              <div>
                <dt>Diện tích</dt>
                <dd>{formatArea(p.area)}</dd>
              </div>
              {p.bedrooms > 0 && (
                <div>
                  <dt>Phòng ngủ</dt>
                  <dd>{p.bedrooms}</dd>
                </div>
              )}
              {p.bathrooms > 0 && (
                <div>
                  <dt>Phòng tắm</dt>
                  <dd>{p.bathrooms}</dd>
                </div>
              )}
            </dl>
          </div>

          {p.description && (
            <div className="panel">
              <h2>Mô tả</h2>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{p.description}</p>
            </div>
          )}
        </div>

        <aside>
          <div className="panel">
            <h2>Liên hệ người đăng</h2>
            <div style={{ fontWeight: 650, fontSize: 16 }}>
              {p.contact_name || 'Nhà Đất Luyện Phát'}
            </div>
            {p.contact_phone && (
              <a
                href={`tel:${p.contact_phone.replace(/\s/g, '')}`}
                className="btn"
                style={{ width: '100%', marginTop: 12 }}
              >
                📞 {p.contact_phone}
              </a>
            )}
          </div>

          <div className="panel">
            <h2>Gửi yêu cầu tư vấn</h2>
            <ContactForm propertyId={p.id} compact />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function Page() {
  // useSearchParams cần Suspense boundary khi prerender
  return (
    <Suspense fallback={<div className="spinner" />}>
      <PropertyDetail />
    </Suspense>
  );
}
