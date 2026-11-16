export interface Channel { id: "youtube" | "facebook" | "tiktok" | "instagram"; name: string; handle: string; url: string; cta: string }

export const siteConfig = {
  name: "Phim Ngắn 0 Đồng",
  tagline: "Nơi những câu chuyện hay được kể mà không cần ngân sách lớn.",
  description: "Phim ngắn mới, hậu trường và chia sẻ cách làm phim với chi phí 0 đồng từ những người làm phim độc lập.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://phimngan0dong.vercel.app",
  youtubeChannelId: "UCufAHF62uTgxgQtRdn7YfgQ",
  contactEmail: "", // điền email hợp tác nếu muốn hiện nút "Gửi email"
  about: "Chiếc điện thoại, những người bạn, những góc phố quen và thật nhiều tâm huyết. Mỗi phim là một lát cắt đời sống, một ý tưởng nhỏ, hay một câu chuyện đang chờ được kể.",
  features: [
    { title: "Phim ngắn mới", text: "Đủ thể loại, cập nhật thường xuyên." },
    { title: "Hậu trường", text: "Cách làm phim với chi phí 0 đồng." },
    { title: "Chia sẻ", text: "Từ những người làm phim độc lập." },
  ],
  channels: [
    { id: "youtube", name: "YouTube", handle: "@phimngan0dong", url: "https://www.youtube.com/@phimngan0dong", cta: "Đăng ký" },
    { id: "facebook", name: "Facebook", handle: "Phim Ngắn 0 Đồng", url: "https://www.facebook.com/profile.php?id=61596357519455", cta: "Theo dõi" },
    { id: "tiktok", name: "TikTok", handle: "@nhclosets", url: "https://www.tiktok.com/@nhclosets", cta: "Theo dõi" },
  ] as Channel[],
};
