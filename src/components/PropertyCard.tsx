import Link from 'next/link';
import type { Property } from '@/lib/types';
import { PROPERTY_TYPE_LABEL, STATUS_LABEL } from '@/lib/types';
import { displayPrice, formatArea } from '@/lib/format';

export default function PropertyCard({ property: p }: { property: Property }) {
  const cover = p.images?.[0];
  const location = [p.address, p.district, p.province].filter(Boolean).join(', ');

  return (
    <article className="card">
      <Link href={`/tin-dang/?id=${p.id}`} className="card-img">
        {cover ? (
          <img src={cover} alt={p.title} loading="lazy" />
        ) : (
          <div className="placeholder">Chưa có ảnh</div>
        )}
        <span className={`badge ${p.status}`}>{STATUS_LABEL[p.status]}</span>
        {p.featured && <span className="badge-featured">Nổi bật</span>}
      </Link>

      <div className="card-body">
        <h3>
          <Link href={`/tin-dang/?id=${p.id}`}>{p.title}</Link>
        </h3>

        {location && (
          <p className="card-spec card-loc">
            <span className="ico" aria-hidden="true">
              📍
            </span>
            <span>{location}</span>
          </p>
        )}

        <div className="card-specs">
          {p.bedrooms > 0 && (
            <p className="card-spec">
              <span className="ico" aria-hidden="true">
                🛏️
              </span>
              Phòng ngủ: <b>{String(p.bedrooms).padStart(2, '0')}</b>
            </p>
          )}
          {p.bathrooms > 0 && (
            <p className="card-spec">
              <span className="ico" aria-hidden="true">
                🚿
              </span>
              Phòng tắm: <b>{String(p.bathrooms).padStart(2, '0')}</b>
            </p>
          )}
          {p.area > 0 && (
            <p className="card-spec">
              <span className="ico" aria-hidden="true">
                📐
              </span>
              Diện tích: <b>{formatArea(p.area)}</b>
            </p>
          )}
          <p className="card-spec">
            <span className="ico" aria-hidden="true">
              🏠
            </span>
            Loại hình: <b>{PROPERTY_TYPE_LABEL[p.property_type]}</b>
          </p>
        </div>

        <div className="card-foot">
          <span className="card-price">{displayPrice(p)}</span>
          <Link href={`/tin-dang/?id=${p.id}`} className="btn-view">
            Xem ngay ›
          </Link>
        </div>
      </div>
    </article>
  );
}
