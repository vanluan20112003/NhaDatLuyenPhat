-- =====================================================================
-- NhaDatLuyenPhat - Supabase schema
-- Chạy toàn bộ file này trong Supabase Dashboard > SQL Editor > New query
-- =====================================================================

-- ---------- Bảng tin đăng bất động sản ----------
create table if not exists public.properties (
  id            bigint generated always as identity primary key,
  title         text        not null,
  description   text,
  price         numeric     not null default 0,          -- đơn vị: VNĐ
  area          numeric     not null default 0,          -- đơn vị: m2
  bedrooms      int         default 0,
  bathrooms     int         default 0,
  property_type text        not null default 'nha'
                check (property_type in ('nha','dat','can-ho','biet-thu','kho-xuong')),
  status        text        not null default 'ban'
                check (status in ('ban','thue','da-ban')),
  address       text,
  district      text,                                    -- quận/huyện
  province      text,                                    -- tỉnh/thành phố
  images        text[]      not null default '{}',        -- mảng URL ảnh
  featured      boolean     not null default false,       -- tin nổi bật
  contact_name  text,
  contact_phone text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists properties_created_at_idx  on public.properties (created_at desc);
create index if not exists properties_type_idx        on public.properties (property_type);
create index if not exists properties_province_idx    on public.properties (province);
create index if not exists properties_price_idx       on public.properties (price);

-- ---------- Bảng liên hệ từ khách ----------
create table if not exists public.contacts (
  id          bigint generated always as identity primary key,
  name        text not null,
  phone       text not null,
  email       text,
  message     text,
  property_id bigint references public.properties(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ---------- Tự động cập nhật updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- Anon key nằm public trong JS bundle, nên RLS là lớp bảo vệ duy nhất.
-- =====================================================================
alter table public.properties enable row level security;
alter table public.contacts   enable row level security;

-- properties: ai cũng ĐỌC được, chỉ user đã đăng nhập mới GHI được
drop policy if exists "properties_public_read"  on public.properties;
create policy "properties_public_read"
  on public.properties for select
  to anon, authenticated
  using (true);

drop policy if exists "properties_auth_insert" on public.properties;
create policy "properties_auth_insert"
  on public.properties for insert
  to authenticated
  with check (true);

drop policy if exists "properties_auth_update" on public.properties;
create policy "properties_auth_update"
  on public.properties for update
  to authenticated
  using (true) with check (true);

drop policy if exists "properties_auth_delete" on public.properties;
create policy "properties_auth_delete"
  on public.properties for delete
  to authenticated
  using (true);

-- contacts: khách GỬI được nhưng KHÔNG đọc được (tránh lộ SĐT khách khác),
-- chỉ admin đăng nhập mới xem/xóa
drop policy if exists "contacts_public_insert" on public.contacts;
create policy "contacts_public_insert"
  on public.contacts for insert
  to anon, authenticated
  with check (true);

drop policy if exists "contacts_auth_read" on public.contacts;
create policy "contacts_auth_read"
  on public.contacts for select
  to authenticated
  using (true);

drop policy if exists "contacts_auth_delete" on public.contacts;
create policy "contacts_auth_delete"
  on public.contacts for delete
  to authenticated
  using (true);

-- =====================================================================
-- STORAGE: bucket chứa ảnh BĐS
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "property_images_public_read" on storage.objects;
create policy "property_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

drop policy if exists "property_images_auth_insert" on storage.objects;
create policy "property_images_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "property_images_auth_delete" on storage.objects;
create policy "property_images_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images');

-- =====================================================================
-- Dữ liệu mẫu (xóa phần này nếu không cần)
-- =====================================================================
insert into public.properties
  (title, description, price, area, bedrooms, bathrooms, property_type, status, address, district, province, featured, contact_name, contact_phone)
values
  ('Nhà phố 3 tầng mặt tiền Nguyễn Văn Cừ',
   'Nhà mới xây, thiết kế hiện đại, gần chợ và trường học. Sổ hồng riêng, công chứng ngay.',
   4500000000, 85, 3, 3, 'nha', 'ban', '123 Nguyễn Văn Cừ', 'Quận 5', 'TP. Hồ Chí Minh', true,
   'Anh Luân', '0901234567'),
  ('Đất nền dự án khu dân cư An Phú',
   'Lô góc 2 mặt tiền, đường nhựa 12m, hạ tầng hoàn thiện, pháp lý rõ ràng.',
   2800000000, 120, 0, 0, 'dat', 'ban', 'Khu dân cư An Phú', 'TP. Thủ Đức', 'TP. Hồ Chí Minh', true,
   'Anh Luân', '0901234567'),
  ('Căn hộ 2PN full nội thất cho thuê',
   'Căn hộ tầng cao view thoáng, đầy đủ nội thất, có hồ bơi và phòng gym.',
   12000000, 65, 2, 2, 'can-ho', 'thue', 'Chung cư Sunrise City', 'Quận 7', 'TP. Hồ Chí Minh', false,
   'Chị Hoa', '0912345678');
