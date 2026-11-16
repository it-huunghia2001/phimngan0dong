"use client";
import { useEffect, useMemo, useState } from "react";
import type { Platform, Video } from "@/lib/types";
import { siteConfig } from "@/config/site";

const LABEL: Record<Platform, string> = { youtube: "YouTube", facebook: "Facebook", tiktok: "TikTok" };
const STEP = 9;

function embedOf(v: Video): { src: string; cls: "land" | "port" } | null {
  if (v.platform === "youtube") return { src: `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`, cls: "land" };
  if (v.platform === "facebook") return { src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(v.url)}&show_text=false&autoplay=true&width=880`, cls: v.url.includes("/reel/") ? "port" : "land" };
  const m = v.url.match(/\/video\/(\d+)/);
  return m ? { src: `https://www.tiktok.com/embed/v2/${m[1]}`, cls: "port" } : null;
}
const fmt = (iso?: string) => { if (!iso) return ""; const d = new Date(iso); return isNaN(+d) ? "" : d.toLocaleDateString("vi-VN"); };

export default function VideoGallery({ videos }: { videos: Video[] }) {
  const [filter, setFilter] = useState<"all" | Platform>("all");
  const [shown, setShown] = useState(STEP);
  const [active, setActive] = useState<Video | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: videos.length };
    videos.forEach((v) => { c[v.platform] = (c[v.platform] ?? 0) + 1; });
    return c;
  }, [videos]);
  const list = filter === "all" ? videos : videos.filter((v) => v.platform === filter);
  const emb = active ? embedOf(active) : null;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [active]);

  const open = (v: Video) => (embedOf(v) ? setActive(v) : window.open(v.url, "_blank", "noopener"));
  const yt = siteConfig.channels.find((c) => c.id === "youtube");

  return (
    <section className="sec" id="video">
      <h2>Xem <span>phim mới</span></h2>
      <p className="sub">Phim ngắn mới nhất, tự động cập nhật từ các kênh của chúng mình.</p>

      {videos.length === 0 ? (
        <p className="sub">Chưa tải được danh sách video. {yt && <a style={{ color: "var(--accent)" }} href={yt.url} target="_blank" rel="noopener noreferrer">Xem trực tiếp trên YouTube ↗</a>}</p>
      ) : (
        <>
          <div className="tabs" role="tablist">
            {(["all", "youtube", "facebook", "tiktok"] as const).filter((k) => counts[k]).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={filter === k} className={"tab" + (filter === k ? " on" : "")}
                onClick={() => { setFilter(k); setShown(STEP); }}>
                {k === "all" ? "Tất cả" : LABEL[k]} ({counts[k]})
              </button>
            ))}
          </div>
          <div className="vgrid">
            {list.slice(0, shown).map((v, i) => (
              <article className={"vcard" + (i === 0 && filter === "all" ? " feat" : "")} key={v.platform + v.id}>
                <button type="button" className="vthumb ph" aria-label={`Phát: ${v.title}`} onClick={() => open(v)}>
                  {v.thumb && <img src={v.thumb} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                  <span className={`badge b-${v.platform}`}>{LABEL[v.platform]}</span>
                  <span className="play" />
                </button>
                <div className="vinfo">
                  <h3>{v.title || `Video trên ${LABEL[v.platform]}`}</h3>
                  <small><span>{fmt(v.published)}</span><a href={v.url} target="_blank" rel="noopener noreferrer">Xem trên {LABEL[v.platform]} ↗</a></small>
                </div>
              </article>
            ))}
          </div>
          {shown < list.length && <div className="row"><button type="button" className="btn ghost" onClick={() => setShown((n) => n + STEP)}>Xem thêm video</button></div>}
        </>
      )}

      {active && emb && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={active.title} onClick={(e) => { if (e.target === e.currentTarget) setActive(null); }}>
          <div className="mbox">
            <button className="mclose" type="button" aria-label="Đóng" onClick={() => setActive(null)}>×</button>
            <div className={`mplayer ${emb.cls}`}>
              <iframe src={emb.src} title={active.title} referrerPolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            </div>
            <div className="mfoot"><span>{active.title}</span><a className="btn primary" href={active.url} target="_blank" rel="noopener noreferrer">Mở trên {LABEL[active.platform]} ↗</a></div>
          </div>
        </div>
      )}
    </section>
  );
}
