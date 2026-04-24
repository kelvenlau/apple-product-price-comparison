import { fetchProductSnapshot } from "./_lib/pricing.js";

export default async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const productId = url.searchParams.get("productId") || "";
    const payload = await fetchProductSnapshot(productId);

    return Response.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "未知错误",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
