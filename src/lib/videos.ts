import { siteConfig } from "@/config/site";
import type { Video } from "./types";

const REVALIDATE = 600; // làm mới dữ liệu mỗi 10 phút
const cache = { next: { revalidate: REVALIDATE } } as const;
const msg = (e: unknown) => (e instanceof Error ? e.message : String(e));
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");

const yt = (id: string, title: string, published: string): Video => ({
  platform: "youtube", id, title, published,
  url: `https://www.youtube.com/watch?v=${id}`,
  thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
});

async function youtubeApi(key: string): Promise<Video[]> {
  const playlist = "UU" + siteConfig.youtubeChannelId.slice(2);
  const out: Video[] = [];
  let token = "";
  for (let i = 0; i < 10; i++) {
    const r = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&key=${key}${token ? "&pageToken=" + token : ""}`, cache);
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error("YouTube API " + r.status + ": " + (e?.error?.message ?? "")); }
    const j = await r.json();
    for (const it of j.items ?? []) {
      const s = it.snippet;
      if (!s?.resourceId || s.title === "Private video" || s.title === "Deleted video") continue;
      out.push(yt(s.resourceId.videoId, s.title, s.publishedAt));
    }
    token = j.nextPageToken ?? "";
    if (!token) break;
  }
  if (!out.length) throw new Error("YouTube API trả về 0 video");
  return out;
}

async function youtubeRss(): Promise<Video[]> {
  const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${siteConfig.youtubeChannelId}`, cache);
  if (!r.ok) throw new Error("YouTube RSS " + r.status);
  const xml = await r.text();
  if (!xml.includes("<entry>")) throw new Error("YouTube RSS không có video nào (có thể bị chặn): " + xml.slice(0, 80).replace(/\s+/g, " "));
  return xml.split("<entry>").slice(1).flatMap((e) => {
    const id = e.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
    if (!id) return [];
    return [yt(id, decode(e.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""), e.match(/<published>(.*?)<\/published>/)?.[1] ?? "")];
  });
}

async function youtube() {
  const key = process.env.YOUTUBE_API_KEY;
  let apiErr = "";
  if (key) { try { return { list: await youtubeApi(key), status: "api" }; } catch (e) { apiErr = msg(e); } }
  try {
    return { list: await youtubeRss(), status: apiErr ? `rss (API lỗi: ${apiErr})` : "rss" };
  } catch (e) {
    throw new Error(msg(e) + (apiErr ? " | " + apiErr : "") + (key ? "" : " | chưa đặt YOUTUBE_API_KEY"));
  }
}

async function facebook() {
  const id = process.env.FB_PAGE_ID, token = process.env.FB_PAGE_TOKEN;
  if (!id || !token) return { list: [] as Video[], status: "off" };
  const fields = "id,title,description,picture,permalink_url,created_time";
  const seen = new Set<string>(), list: Video[] = [];
  let err = "";
  for (const edge of ["videos", "video_reels"]) {
    const r = await fetch(`https://graph.facebook.com/v21.0/${id}/${edge}?fields=${fields}&limit=50&access_token=${token}`, cache);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { err = j?.error?.message ?? "HTTP " + r.status; continue; }
    for (const v of j.data ?? []) {
      if (seen.has(v.id)) continue;
      seen.add(v.id);
      const p: string = v.permalink_url ?? "";
      list.push({
        platform: "facebook", id: v.id,
        url: p ? (p.startsWith("http") ? p : "https://www.facebook.com" + p) : `https://www.facebook.com/${id}/videos/${v.id}`,
        title: (v.title || (v.description ?? "").split("\n")[0] || "").slice(0, 120),
        published: v.created_time, thumb: v.picture ?? "",
      });
    }
  }
  return { list, status: list.length ? "ok" : err ? "error: " + err : "empty" };
}

export async function getVideos() {
  const [y, f] = await Promise.allSettled([youtube(), facebook()]);
  const videos: Video[] = [];
  const sources: Record<string, string> = {};
  (["youtube", "facebook"] as const).forEach((name, i) => {
    const r = i === 0 ? y : f;
    if (r.status === "fulfilled") { videos.push(...r.value.list); sources[name] = r.value.status; }
    else sources[name] = "error: " + msg(r.reason);
  });
  videos.sort((a, b) => +new Date(b.published ?? 0) - +new Date(a.published ?? 0));
  return { videos, sources };
}
