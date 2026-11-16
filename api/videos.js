// Vercel serverless function: gộp video YouTube + Facebook thành một danh sách
// Biến môi trường (đặt trong Vercel → Settings → Environment Variables):
//   YOUTUBE_API_KEY  (khuyên dùng) lấy đủ mọi video; không có thì chỉ lấy 15 video mới nhất qua RSS
//   FB_PAGE_ID, FB_PAGE_TOKEN      lấy video + reels của Facebook Page
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UCufAHF62uTgxgQtRdn7YfgQ";
const YT_KEY = process.env.YOUTUBE_API_KEY;
const FB_ID = process.env.FB_PAGE_ID;
const FB_TOKEN = process.env.FB_PAGE_TOKEN;

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
const yt = (id, title, published) => ({
  platform: "youtube", id, title, published,
  url: "https://www.youtube.com/watch?v=" + id,
  thumb: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg",
});

async function youtubeApi() {
  const playlist = "UU" + CHANNEL_ID.slice(2);
  const out = [];
  let token = "";
  for (let i = 0; i < 10; i++) {
    const r = await fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" +
        playlist + "&key=" + YT_KEY + (token ? "&pageToken=" + token : "")
    );
    if (!r.ok) throw new Error("YouTube API " + r.status);
    const j = await r.json();
    for (const it of j.items || []) {
      const s = it.snippet;
      if (!s || !s.resourceId || s.title === "Private video" || s.title === "Deleted video") continue;
      out.push(yt(s.resourceId.videoId, s.title, s.publishedAt));
    }
    token = j.nextPageToken;
    if (!token) break;
  }
  return out;
}

async function youtubeRss() {
  const r = await fetch("https://www.youtube.com/feeds/videos.xml?channel_id=" + CHANNEL_ID);
  if (!r.ok) throw new Error("RSS " + r.status);
  const xml = await r.text();
  return xml.split("<entry>").slice(1).map((e) => {
    const id = (e.match(/<yt:videoId>(.*?)<\/yt:videoId>/) || [])[1];
    const title = (e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
    const pub = (e.match(/<published>(.*?)<\/published>/) || [])[1] || "";
    return id ? yt(id, decode(title), pub) : null;
  }).filter(Boolean);
}

async function youtube() {
  if (YT_KEY) { try { return { list: await youtubeApi(), status: "api" }; } catch (e) {} }
  return { list: await youtubeRss(), status: "rss" };
}

async function facebook() {
  if (!FB_ID || !FB_TOKEN) return { list: [], status: "off" };
  const fields = "id,title,description,picture,permalink_url,created_time";
  const seen = new Set(), list = [];
  let err = "";
  for (const edge of ["videos", "video_reels"]) {
    const r = await fetch(`https://graph.facebook.com/v21.0/${FB_ID}/${edge}?fields=${fields}&limit=50&access_token=${FB_TOKEN}`);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { err = (j.error && j.error.message) || "HTTP " + r.status; continue; }
    for (const v of j.data || []) {
      if (seen.has(v.id)) continue;
      seen.add(v.id);
      const p = v.permalink_url || "";
      list.push({
        platform: "facebook", id: v.id,
        url: p ? (p.startsWith("http") ? p : "https://www.facebook.com" + p) : `https://www.facebook.com/${FB_ID}/videos/${v.id}`,
        title: (v.title || (v.description || "").split("\n")[0] || "").slice(0, 120),
        published: v.created_time, thumb: v.picture || "",
      });
    }
  }
  return { list, status: list.length ? "ok" : err ? "error: " + err : "empty" };
}

module.exports = async (req, res) => {
  const [y, f] = await Promise.allSettled([youtube(), facebook()]);
  const videos = [], sources = {};
  for (const [name, r] of [["youtube", y], ["facebook", f]]) {
    if (r.status === "fulfilled") { videos.push(...r.value.list); sources[name] = r.value.status; }
    else sources[name] = "error: " + (r.reason && r.reason.message);
  }
  videos.sort((a, b) => new Date(b.published || 0) - new Date(a.published || 0));
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
  res.status(200).json({ sources, videos });
};
