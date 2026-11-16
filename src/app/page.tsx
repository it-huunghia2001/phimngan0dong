import { siteConfig } from "@/config/site";
import { getVideos } from "@/lib/videos";
import { About, Channels, Contact, Footer, Header, Hero } from "@/components/sections";
import VideoGallery from "@/components/VideoGallery";
import TikTokEmbed from "@/components/TikTokEmbed";

export const revalidate = 600;

export default async function Home() {
  const { videos } = await getVideos();
  const tiktok = siteConfig.channels.find((c) => c.id === "tiktok");
  const handle = tiktok?.url.match(/@([\w.]+)/)?.[1];
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Organization",
    name: siteConfig.name, url: siteConfig.url, description: siteConfig.description,
    sameAs: siteConfig.channels.map((c) => c.url).filter(Boolean),
  };
  return (
    <div className="wrap">
      <Header />
      <main>
        <Hero count={videos.length} />
        <VideoGallery videos={videos} />
        {tiktok && handle && (
          <section className="sec" id="tiktok">
            <h2>Trên <span>TikTok</span></h2>
            <p className="sub">Video mới nhất, tự cập nhật từ TikTok.</p>
            <TikTokEmbed url={tiktok.url} handle={handle} />
            <div className="row"><a className="btn primary" href={tiktok.url} target="_blank" rel="noopener noreferrer">Mở TikTok ↗</a></div>
          </section>
        )}
        <About />
        <Channels />
        <Contact />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
