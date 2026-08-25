/**
 * Static export, deploy song song 2 nơi:
 *
 *  - GitHub Pages: site nằm ở /NhaDatLuyenPhat (repo không phải <user>.github.io)
 *    => workflow truyền BASE_PATH=/NhaDatLuyenPhat vào.
 *  - Cloudflare Workers: site nằm ở gốc "/" => không set BASE_PATH.
 *
 * Local (npm run dev) cũng chạy ở "/" cho tiện.
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
