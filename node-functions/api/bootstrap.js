import { getBootstrapData } from "./_lib/pricing.js";

export default function onRequest() {
  return Response.json(getBootstrapData(), {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
