/**
 * Giá hiển thị trên web.
 * Ưu tiên price_text do người đăng tự nhập ("8xx triệu", "Thương lượng"),
 * vì tin bất động sản thường không nêu con số chính xác.
 * Không có thì format từ cột price số.
 */
export function displayPrice(p: {
  price: number;
  price_text?: string | null;
  status?: string;
}): string {
  const text = p.price_text?.trim();
  if (text) {
    // Người đăng tự viết "/tháng" nếu muốn, không tự thêm để tránh lặp
    return text;
  }
  return formatPrice(p.price, p.status);
}

/** 4500000000 -> "4,5 tỷ" ; 12000000 -> "12 triệu" */
export function formatPrice(price: number, status?: string): string {
  const suffix = status === 'thue' ? '/tháng' : '';
  if (!price) return 'Thỏa thuận';
  if (price >= 1_000_000_000) {
    return `${trim(price / 1_000_000_000)} tỷ${suffix}`;
  }
  if (price >= 1_000_000) {
    return `${trim(price / 1_000_000)} triệu${suffix}`;
  }
  return `${price.toLocaleString('vi-VN')} đ${suffix}`;
}

function trim(n: number): string {
  // 4.5 -> "4,5" ; 3.0 -> "3"
  return n.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
}

export function formatArea(area: number): string {
  return `${trim(area)} m²`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Ghép basePath vào đường dẫn asset trong /public khi deploy lên GitHub Pages */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return `${base}${path}`;
}
