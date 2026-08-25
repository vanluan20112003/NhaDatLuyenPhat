'use client';

import { usePathname } from 'next/navigation';
import FloatingContact from './FloatingContact';

/** Trang quản trị không phải nơi quảng bá nên ẩn cụm nút liên hệ. */
const HIDDEN_PREFIXES = ['/admin'];

export default function FloatingContactGate() {
  const pathname = usePathname() ?? '';

  // basePath (/NhaDatLuyenPhat trên GitHub Pages) nằm sẵn trong pathname,
  // nên cắt bỏ trước khi so khớp.
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const route = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;

  if (HIDDEN_PREFIXES.some((p) => route === p || route.startsWith(`${p}/`))) {
    return null;
  }

  return <FloatingContact />;
}
