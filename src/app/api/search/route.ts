import { searchProducts } from "@/lib/catalog/repository";

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 80);
  const items = await searchProducts(q, 8);
  return Response.json({ items }, { headers: { "Cache-Control": "public, max-age=60" } });
}
