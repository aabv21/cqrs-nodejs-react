import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import {
  createProxyMiddleware,
  fixRequestBody,
  Options,
} from "http-proxy-middleware";
import cors from "cors";

const app = express();

// Logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  // Track response
  res.on("finish", () => {
    console.log(`[${timestamp}] ${req.method} ${req.url} ${res.statusCode}`);
  });

  next();
});

// Proxy configuration
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
    router: (req) => {
      return ["POST", "PUT", "PATCH", "DELETE"].includes(req.method!)
        ? "http://localhost:3001" // Command service
        : "http://localhost:3002"; // Query service
    },
    onProxyReq: fixRequestBody,
    onProxyRes: (proxyRes, req, res) => {
      console.log("Proxy response status:", proxyRes.statusCode);
    },
    onError: (err, req, res) => {
      console.error("Proxy Error:", err);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to proxy request",
      });
    },
    logLevel: "debug",
  } as Options)
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
