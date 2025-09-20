import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.BUCKET;


if (!accessKeyId || !secretAccessKey || !bucket || !endpoint) {
  throw new Error("Missing required environment variables.");
}

const s3Client = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint,
});

export { s3Client, PutObjectCommand };