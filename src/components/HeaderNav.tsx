'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

/**
 * Nút cuối thanh điều hướng đổi theo trạng thái đăng nhập:
 * chưa đăng nhập -> "Đăng nhập", đã đăng nhập -> "Quản lý".
 */
export default function HeaderNav() {
  // undefined = chưa biết (tránh nhấp nháy nút sai lúc mới tải trang)
  const [signedIn, setSignedIn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <nav className="nav">
      <Link href="/">Trang chủ</Link>
      <Link href="/lien-he/">Liên hệ</Link>
      <Link href="/admin/" className="cta">
        {signedIn === undefined ? ' ' : signedIn ? 'Quản lý' : 'Đăng nhập'}
      </Link>
    </nav>
  );
}
