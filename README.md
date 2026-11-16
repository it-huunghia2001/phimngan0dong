# Phim Ngắn 0 Đồng – website (Next.js 15, App Router, TypeScript)

## Chạy thử
```
npm install
npm run dev        # http://localhost:3000
```
## Triển khai Vercel
Đưa thư mục này lên GitHub → vercel.com → Add New Project → Deploy (Vercel tự nhận Next.js).

## Biến môi trường (Vercel → Settings → Environment Variables, rồi Redeploy)
| Tên | Ý nghĩa |
|---|---|
| NEXT_PUBLIC_SITE_URL | Tên miền chính thức (SEO, sitemap, ảnh chia sẻ) |
| YOUTUBE_API_KEY | Lấy đủ mọi video YouTube (không có thì chỉ 15 video mới nhất qua RSS) |
| FB_PAGE_ID, FB_PAGE_TOKEN | Lấy video + reels của Facebook Page (Page access token dài hạn) |

Kiểm tra: mở `/api/videos` → mục `sources` báo từng nền tảng `api` / `rss` / `ok` / `off` / `error: lý do`.

## Cấu trúc
- `src/config/site.ts` – nội dung, link kênh, email liên hệ (sửa ở đây)
- `src/lib/videos.ts` – lấy dữ liệu YouTube / Facebook (cache 10 phút). Thêm nền tảng: viết thêm một hàm và đưa vào `getVideos()`
- `src/components/` – giao diện (sections, VideoGallery, TikTokEmbed)
- `src/app/` – trang, SEO (metadata, sitemap, robots, JSON-LD), favicon `icon.svg`
- `public/og.png` – ảnh khi chia sẻ link lên Facebook/Zalo
