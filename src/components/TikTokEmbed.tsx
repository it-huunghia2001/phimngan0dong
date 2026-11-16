"use client";
import { useEffect, useRef } from "react";

// Khung "creator" chính thức của TikTok: tự hiện video mới nhất của tài khoản
export default function TikTokEmbed({ url, handle }: { url: string; handle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = `<blockquote class="tiktok-embed" cite="${url}" data-unique-id="${handle}" data-embed-type="creator" style="max-width:780px;min-width:288px"><section><a target="_blank" rel="noopener" href="${url}">@${handle}</a></section></blockquote>`;
    const s = document.createElement("script");
    s.src = "https://www.tiktok.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { s.remove(); el.innerHTML = ""; };
  }, [url, handle]);
  return <div className="tt" ref={ref} />;
}
