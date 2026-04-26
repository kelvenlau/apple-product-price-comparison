import { getBootstrapData } from "./_lib/pricing.js";

export default function onRequest() {
  return Response.json(getBootstrapData(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
