import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { Logger } from "./utils/Logger";

export function setupSideCar(target: string, service: string) {
  const sidecar = express();
  const logger = new Logger(service);

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
  });

  sidecar.use("*", (req, res, next) => {
    logger.log(target, req.url);
    proxy(req, res, next);
  });

  return sidecar;
}
