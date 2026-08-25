/**
 * Static export cho GitHub Pages.
 * Repo không phải <user>.github.io nên site nằm ở /NhaDatLuyenPhat
 * => cần basePath. Biến BASE_PATH do workflow truyền vào,
 * để chạy local (npm run dev) vẫn ở "/" cho tiện.
 */
const basePath = process.env.BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  basePath,
  // GitHub Pages phục vụ file tĩnh, không có Image Optimization server
  images: { unoptimized: true },
  // /property/1 -> /property/1/index.html, tránh 404 khi refresh
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
