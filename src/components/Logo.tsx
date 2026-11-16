export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Logo Phim Ngắn 0 Đồng">
      <circle cx="100" cy="100" r="92" fill="#ffb81c" />
      <g fill="#141110">{Array.from({ length: 24 }, (_, i) => <rect key={i} x="97" y="14" width="6" height="9" transform={`rotate(${i * 15} 100 100)`} />)}</g>
      <circle cx="100" cy="100" r="64" fill="#141110" />
      <path d="M86 70v60l50-30z" fill="#f4eee3" />
    </svg>
  );
}
