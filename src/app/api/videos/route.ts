import { getVideos } from "@/lib/videos";
export const revalidate = 600;
// Mở /api/videos để kiểm tra: "sources" cho biết từng nền tảng đang chạy ở trạng thái nào
export async function GET() { return Response.json(await getVideos()); }
