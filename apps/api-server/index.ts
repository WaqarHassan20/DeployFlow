// import { initKafkaConsumer } from "./utils/kafkaConsumer";
import { projectRoute } from "./routes/projectRoute.js";
import { deployRoute } from "./routes/deployRoute.js";
import { userRoute } from "./routes/userRoute.js";
import { logsRoute } from "./routes/logsRoute.js";

import express from "express";
import cors from "cors";
import "dotenv/config";

const API_PORT = process.env.API_PORT || 9000;
// Ensure API_PORT is set
if (!API_PORT) {
  throw new Error("Missing required environment variables: API_PORT");
}

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
// In development we reflect the request origin (allows localhost:3000, 127.0.0.1, etc.)
const isDev = process.env.NODE_ENV === 'development';
const configuredFrontend = process.env.FRONTEND_URL;
const corsOrigin: any = isDev ? (configuredFrontend || true) : (configuredFrontend || 'http://localhost:3000');

app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

console.log(`API CORS configuration -> NODE_ENV=${process.env.NODE_ENV || 'development'}, FRONTEND_URL=${configuredFrontend || 'unset'}, corsOrigin=${corsOrigin}`);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/user", userRoute);
app.use("/project", projectRoute);
app.use("/deploy", deployRoute);
app.use("/logs", logsRoute);

// app.delete("/clear-bucket", async (req, res) => {
//   try {
//     // List all objects
//     const listResponse = await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));
//     const objects = listResponse.Contents;

//     if (!objects || objects.length === 0) {
//       return res.status(200).json({ message: "Bucket is already empty" });
//     }

//     // Delete all objects
//     const deleteParams = {
//       Bucket: bucketName,
//       Delete: { Objects: objects.map(obj => ({ Key: obj.Key! })) },
//     };

//     await s3.send(new DeleteObjectsCommand(deleteParams));

//     return res.status(200).json({ message: "Bucket cleared successfully", deleted: objects.length });
//   } catch (err) {
//     console.error("Error clearing bucket:", err);
//     return res.status(500).json({ error: "Failed to clear bucket", details: err });
//   }
// });

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Initialize Kafka consumer
// initKafkaConsumer();

app.listen(API_PORT, () => {
  console.log(`🚀 API Server is listening on port ${API_PORT}`);
  console.log(`📊 Health check available at http://localhost:${API_PORT}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
