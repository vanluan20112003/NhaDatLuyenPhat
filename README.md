# Nhà Đất Luyện Phát

Web bất động sản tĩnh: Next.js 16 (static export) + Supabase, deploy miễn phí lên GitHub Pages.

**Live:** https://vanluan20112003.github.io/NhaDatLuyenPhat/

## Tính năng

| Trang | Đường dẫn | Mô tả |
|---|---|---|
| Trang chủ | `/` | Danh sách tin đăng, lọc theo từ khóa / loại hình / nhu cầu / tỉnh thành / khoảng giá |
| Chi tiết | `/tin-dang/?id=N` | Ảnh, thông số, mô tả, thông tin liên hệ, form tư vấn |
| Liên hệ | `/lien-he/` | Form gửi yêu cầu tư vấn |
| Quản trị | `/admin/` | Đăng nhập Supabase Auth, CRUD tin đăng, upload ảnh, xem liên hệ |

## Kiến trúc

GitHub Pages chỉ phục vụ file tĩnh — không có server. Vì vậy:

- Toàn bộ dữ liệu được gọi **trực tiếp từ browser** tới Supabase bằng anon key.
- Anon key nằm công khai trong JS bundle. **Row Level Security là lớp bảo vệ duy nhất** — xem `supabase/schema.sql`.
- Trang chi tiết dùng query string (`/tin-dang/?id=5`) thay vì route động, để tin đăng mới xem được ngay mà không cần build lại.

## Thiết lập lần đầu

### 1. Tạo bảng trong Supabase

Mở Supabase Dashboard → **SQL Editor** → **New query**, dán toàn bộ nội dung `supabase/schema.sql` rồi **Run**.

File này tạo: bảng `properties`, bảng `contacts`, RLS policies, storage bucket `property-images`, và 3 tin đăng mẫu.

### 2. Tạo tài khoản admin

Supabase Dashboard → **Authentication** → **Users** → **Add user** → **Create new user**.
Nhập email + mật khẩu, bật *Auto Confirm User*. Đây là tài khoản đăng nhập `/admin/`.

### 3. Cấu hình biến trên GitHub

Repo → **Settings** → **Secrets and variables** → **Actions** → tab **Variables**:

| Tên | Lấy ở đâu |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |

### 4. Bật GitHub Pages

Repo → **Settings** → **Pages** → **Source**: chọn **GitHub Actions**.

Sau đó mỗi lần push lên `main`, workflow `.github/workflows/deploy.yml` sẽ tự build và deploy.

## Chạy local

```bash
npm install
cp .env.local.example .env.local   # rồi điền URL + anon key thật
npm run dev                        # http://localhost:3000
```

Build thử bản production:

```bash
npm run build                      # kết quả trong ./out
```

## Custom domain

1. Thêm file `public/CNAME` chứa đúng tên miền (ví dụ `nhadatluyenphat.vn`).
2. Trỏ DNS về GitHub Pages:
   - Apex domain → 4 bản ghi `A`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Subdomain (`www`) → bản ghi `CNAME`: `vanluan20112003.github.io`
3. Repo → Settings → Pages → **Custom domain** → nhập tên miền → bật **Enforce HTTPS**.

Khi dùng custom domain, site nằm ở gốc `/` nên `BASE_PATH` phải rỗng — `actions/configure-pages` tự xử lý việc này.
