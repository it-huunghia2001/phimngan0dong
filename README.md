# Phim Ngắn 0 Đồng – website

Triển khai: `npx vercel --prod` (giữ nguyên thư mục `api/`).

## Biến môi trường trên Vercel (Settings → Environment Variables), sau đó Redeploy
| Tên | Dùng để |
|---|---|
| YOUTUBE_API_KEY | Lấy đủ mọi video YouTube (không có thì chỉ 15 video mới nhất) |
| FB_PAGE_ID | ID của Facebook Page |
| FB_PAGE_TOKEN | Page access token (loại dài hạn) |

Kiểm tra: mở `https://<tên-miền>/api/videos` – mục `sources` cho biết youtube/facebook đang chạy ở trạng thái nào.
