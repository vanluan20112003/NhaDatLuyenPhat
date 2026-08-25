'use client';

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Build sẽ inline giá trị lúc compile; thiếu biến là lỗi cấu hình, báo sớm cho dễ tìm.
  throw new Error(
    'Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Chạy local: tạo file .env.local. Trên GitHub: kiểm tra Repository variables.'
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    // Phiên lưu trong localStorage nên còn nguyên sau khi đóng trình duyệt.
    // (Site tĩnh, không có server nên không dùng cookie được.)
    persistSession: true,
    // Tự làm mới access token trước khi hết hạn -> không phải đăng nhập lại
    autoRefreshToken: true,
    storageKey: 'ndlp-auth',
    detectSessionInUrl: false,
  },
});
