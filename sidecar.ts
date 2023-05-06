import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

/* app.listen(8080, () => {
  console.log("Sidecar proxy listening on port 8080");
}); */

export function setupSideCar(target: string) {
  const sidecar = express();

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
  });

  sidecar.use("*", proxy);

  return sidecar;
}
