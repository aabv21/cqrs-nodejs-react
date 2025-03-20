import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Routes
import postsRouter from "./routes/posts";

const app = express();

// Move the debug middleware AFTER the body parsers
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Global middleware hit:", {
    method: req.method,
    path: req.url,
    body: req.body,
  });
  next();
});

// Debug middleware for all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const start = Date.now();

  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request Body:", JSON.stringify(req.body));
  }

  // Track response
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
});

// Middleware should be added BEFORE routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes should come after all middleware
app.use(
  "/posts",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Posts route matched:", {
      originalUrl: req.originalUrl,
      baseUrl: req.baseUrl,
      path: req.path,
    });
    next();
  },
  postsRouter
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(`[ERROR] ${err.stack}`);

  if (err.name === "ValidationError") {
    res.status(400).json({
      error: "Validation Error",
      message: err.message,
    });
    return;
  }

  if (err.name === "NotFoundError") {
    res.status(404).json({
      error: "Not Found",
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
});

// 404 handler for unmatched routes - should be after all valid routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.url}`,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Command service running on port ${PORT}`);
});
