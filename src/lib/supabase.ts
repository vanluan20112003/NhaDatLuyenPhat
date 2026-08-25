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

export const supabase = createClient(url, anonKey);
