import { siteConfig } from "@/config/site";
import { LogoMark } from "./Logo";
import { BRAND, PlatformIcon } from "./icons";

const yt = siteConfig.channels.find((c) => c.id === "youtube");

export function Header() {
  return (
    <nav aria-label="Chính">
      <a className="brand" href="#top"><LogoMark className="mini" />0 ĐỒNG</a>
      <div className="links"><a href="#video">Video</a><a href="#gioi-thieu">Giới thiệu</a><a href="#kenh">Kênh</a><a href="#lien-he">Liên hệ</a></div>
    </nav>
  );
}

export function Hero({ count }: { count: number }) {
  return (
    <header className="hero" id="top">
      <LogoMark className="logo" />
      <small>PHIM NGẮN</small>
      <h1>0 ĐỒNG</h1>
      <p>{siteConfig.tagline}</p>
      <div className="btns">
        <a className="btn primary" href="#video">Xem phim mới</a>
        {yt && <a className="btn ghost" href={`${yt.url}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer">Đăng ký kênh</a>}
      </div>
      {count > 0 && <p className="stat">{count} video · cập nhật liên tục</p>}
    </header>
  );
}

export function About() {
  return (
    <section className="sec" id="gioi-thieu">
      <h2>Làm phim bằng <span>những gì đang có</span></h2>
      <p className="sub">{siteConfig.about}</p>
      <div className="grid3">
        {siteConfig.features.map((f) => <div className="card" key={f.title}><b>{f.title}</b><p>{f.text}</p></div>)}
      </div>
    </section>
  );
}

export function Channels() {
  return (
    <section className="sec" id="kenh">
      <h2>Theo dõi <span>chúng mình</span></h2>
      <p className="sub">Đăng ký và theo dõi để không bỏ lỡ phim mới.</p>
      <div className="channels">
        {siteConfig.channels.filter((c) => c.url).map((c) => (
          <a className="ch" key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" style={{ "--c": BRAND[c.id] } as React.CSSProperties}>
            <div className="ic"><PlatformIcon name={c.id} /></div>
            <div><b>{c.name}</b><br /><span>{c.handle}</span></div>
            <em>{c.cta} →</em>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  const fb = siteConfig.channels.find((c) => c.id === "facebook");
  const mail = siteConfig.contactEmail;
  return (
    <section className="sec" id="lien-he">
      <h2>Hợp tác &amp; <span>liên hệ</span></h2>
      <p className="sub">Bạn muốn góp ý, hợp tác làm phim hay mời chúng mình tham gia dự án? Nhắn cho chúng mình nhé.</p>
      <div className="row">
        {mail && <a className="btn primary" href={`mailto:${mail}`}>Gửi email</a>}
        {fb && <a className={`btn ${mail ? "ghost" : "primary"}`} href={fb.url} target="_blank" rel="noopener noreferrer">Nhắn qua Facebook</a>}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="flinks">{siteConfig.channels.map((c) => <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>)}</div>
      © {new Date().getFullYear()} {siteConfig.name} · Đăng ký kênh và bật chuông để không bỏ lỡ phim mới.
    </footer>
  );
}
