'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/lib/types';
import { PROPERTY_TYPE_LABEL } from '@/lib/types';
import PropertyCard from '@/components/PropertyCard';

const PRICE_RANGES = [
  { label: 'Mọi mức giá', min: 0, max: Infinity },
  { label: 'Dưới 1 tỷ', min: 0, max: 1_000_000_000 },
  { label: '1 - 3 tỷ', min: 1_000_000_000, max: 3_000_000_000 },
  { label: '3 - 5 tỷ', min: 3_000_000_000, max: 5_000_000_000 },
  { label: '5 - 10 tỷ', min: 5_000_000_000, max: 10_000_000_000 },
  { label: 'Trên 10 tỷ', min: 10_000_000_000, max: Infinity },
];

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // bộ lọc
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [province, setProvince] = useState('');
  const [priceIdx, setPriceIdx] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) setError(error.message);
      else setProperties((data ?? []) as Property[]);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // danh sách tỉnh/thành lấy từ chính dữ liệu, khỏi hardcode
  const provinces = useMemo(() => {
    const set = new Set(
      properties.map((p) => p.province).filter((v): v is string => !!v)
    );
    return [...set].sort((a, b) => a.localeCompare(b, 'vi'));
  }, [properties]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const range = PRICE_RANGES[priceIdx];

    return properties.filter((p) => {
      if (type && p.property_type !== type) return false;
      if (status && p.status !== status) return false;
      if (province && p.province !== province) return false;
      if (p.price < range.min || p.price > range.max) return false;
      if (kw) {
        const haystack = [p.title, p.description, p.address, p.district, p.province]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      return true;
    });
  }, [properties, keyword, type, status, province, priceIdx]);

  const hasFilter =
    !!keyword || !!type || !!status || !!province || priceIdx !== 0;

  function resetFilters() {
    setKeyword('');
    setType('');
    setStatus('');
    setProvince('');
    setPriceIdx(0);
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>
              Tìm nhà thông thái
              <br />
              Thoải mái an cư
            </h1>
            <p>
              Nhà Đất Luyện Phát tuyển chọn tin đăng nhà phố, đất nền, căn hộ với
              pháp lý rõ ràng. Hàng trăm bất động sản phù hợp{' '}
              <b>dành riêng cho bạn</b>. Bắt đầu tìm kiếm ngay!
            </p>

            <ul className="hero-trust">
              <li>
                <b>{properties.length}</b> tin đang mở bán
              </li>
              <li>
                <b>Pháp lý</b> kiểm chứng
              </li>
              <li>
                <b>Tư vấn</b> tận nơi
              </li>
            </ul>
          </div>

          <aside className="hero-promo">
            <span className="promo-tag">Nhà Đất Luyện Phát</span>
            <strong>
              Ký gửi nhà đất
              <br />
              bán nhanh giá tốt
            </strong>
            <p>Uy tín tạo giá trị — Đồng hành cùng phát triển</p>
            <a href="tel:0354434852" className="promo-cta">
              Gọi 0354 434 852
            </a>
          </aside>
        </div>

        <div className="container">
          <div className="searchbar">
            {/* Tab Mua / Thuê: lọc nhanh theo nhu cầu phổ biến nhất */}
            <div className="sb-tabs" role="tablist" aria-label="Nhu cầu">
              {[
                { v: '', label: 'Tất cả' },
                { v: 'ban', label: 'Mua' },
                { v: 'thue', label: 'Thuê' },
              ].map((t) => (
                <button
                  key={t.v || 'all'}
                  role="tab"
                  aria-selected={status === t.v}
                  className={status === t.v ? 'active' : ''}
                  onClick={() => setStatus(t.v)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="sb-main">
              <span className="sb-ico" aria-hidden="true">
                🔍
              </span>
              <input
                type="search"
                placeholder="Địa chỉ, khu vực, tên dự án..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="Tìm kiếm theo từ khóa"
              />
              <button
                type="button"
                className="sb-more"
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
              >
                Bộ lọc {showFilters ? '▴' : '▾'}
              </button>
            </div>

            {showFilters && (
              <div className="sb-filters">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  aria-label="Loại bất động sản"
                >
                  <option value="">Mọi loại hình</option>
                  {Object.entries(PROPERTY_TYPE_LABEL).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>

                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  aria-label="Tỉnh thành"
                >
                  <option value="">Mọi tỉnh thành</option>
                  {provinces.map((pv) => (
                    <option key={pv} value={pv}>
                      {pv}
                    </option>
                  ))}
                </select>

                <select
                  value={priceIdx}
                  onChange={(e) => setPriceIdx(Number(e.target.value))}
                  aria-label="Khoảng giá"
                >
                  {PRICE_RANGES.map((r, i) => (
                    <option key={r.label} value={i}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="section-head">
          <h2>Tin đăng mới nhất</h2>
          <span className="count">
            {loading ? 'Đang tải...' : `${filtered.length} tin`}
            {hasFilter && !loading && (
              <>
                {' · '}
                <button
                  onClick={resetFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    font: 'inherit',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  Xóa bộ lọc
                </button>
              </>
            )}
          </span>
        </div>

        {loading && <div className="spinner" />}

        {error && (
          <div className="alert alert-err">
            Không tải được dữ liệu: {error}
            <br />
            Kiểm tra lại bảng <code>properties</code> và RLS policy trên Supabase.
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty">
            {properties.length === 0
              ? 'Chưa có tin đăng nào. Vào trang Quản trị để đăng tin đầu tiên.'
              : 'Không tìm thấy tin đăng nào khớp bộ lọc.'}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid">
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
