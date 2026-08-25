import Link from 'next/link';
import type { Property } from '@/lib/types';
import { PROPERTY_TYPE_LABEL, STATUS_LABEL } from '@/lib/types';
import { formatPrice, formatArea } from '@/lib/format';

export default function PropertyCard({ property: p }: { property: Property }) {
  const cover = p.images?.[0];
  const location = [p.district, p.province].filter(Boolean).join(', ');

  return (
    <Link href={`/tin-dang/?id=${p.id}`} className="card">
      <div className="card-img">
        {cover ? (
          <img src={cover} alt={p.title} loading="lazy" />
        ) : (
          <div className="placeholder">Chưa có ảnh</div>
        )}
        <span className={`badge ${p.status}`}>{STATUS_LABEL[p.status]}</span>
        {p.featured && <span className="badge-featured">Nổi bật</span>}
      </div>

      <div className="card-body">
        <h3>{p.title}</h3>
        <div className="card-price">{formatPrice(p.price, p.status)}</div>
        {location && <div className="card-loc">📍 {location}</div>}
        <div className="card-meta">
          <span>{formatArea(p.area)}</span>
          {p.bedrooms > 0 && <span>{p.bedrooms} PN</span>}
          {p.bathrooms > 0 && <span>{p.bathrooms} WC</span>}
          <span style={{ marginLeft: 'auto' }}>
            {PROPERTY_TYPE_LABEL[p.property_type]}
          </span>
        </div>
      </div>
    </Link>
  );
}
