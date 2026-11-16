// Lấy ảnh bìa + tiêu đề video TikTok (chạy phía máy chủ)
module.exports = async (req, res) => {
  const u = String(req.query.url || "");
  if (!/^https:\/\/(www\.|vm\.|vt\.)?tiktok\.com\//.test(u)) {
    res.status(400).json({ error: "bad url" });
    return;
  }
  try {
    const r = await fetch("https://www.tiktok.com/oembed?url=" + encodeURIComponent(u));
    if (!r.ok) throw new Error("tiktok " + r.status);
    const j = await r.json();
    res.setHeader("Cache-Control", "s-maxage=43200, stale-while-revalidate=86400");
    res.status(200).json({ title: j.title, thumbnail_url: j.thumbnail_url, author_name: j.author_name });
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
};
