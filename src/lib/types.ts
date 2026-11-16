export type Platform = "youtube" | "facebook" | "tiktok";
export interface Video { platform: Platform; id: string; url: string; title: string; published?: string; thumb?: string }
