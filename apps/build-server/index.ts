import { s3Client, PutObjectCommand } from "@repo/awss3";
import { exec } from "child_process";
import mime from "mime";
import path from "path";
import fs from "fs";

// Initialize S3 client
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.BUCKET;

if (!accessKeyId || !secretAccessKey || !endpoint || !bucket) {
  throw new Error("Missing S3 environment variables.");
}

const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;
const PROJECT_ID = process.env.PROJECT_ID;
const DATABASE_URL = process.env.DATABASE_URL;

console.log("🔧 Environment Variables Loaded:", {
  DEPLOYMENT_ID,
  PROJECT_ID,
  S3_ACCESS_KEY_ID: accessKeyId ? "***" + accessKeyId.slice(-4) : "missing",
  S3_SECRET_ACCESS_KEY: secretAccessKey
    ? "***" + secretAccessKey.slice(-4)
    : "missing",
  S3_ENDPOINT: endpoint,
  BUCKET: bucket,
  DATABASE_URL: DATABASE_URL ? "***" + DATABASE_URL.slice(-10) : "missing (console-only mode)",
});

if (!DEPLOYMENT_ID || !PROJECT_ID) {
  throw new Error(
    "Missing required environment variables: DEPLOYMENT_ID, PROJECT_ID"
  );
}

console.log(`Project ID: ${PROJECT_ID}`);
console.log(`Deployment ID: ${DEPLOYMENT_ID}`);

// ✅ Console-only logger
const PublishLog = async (message: string, level: string = "INFO") => {
  console.log(`[${level}] ${message}`);
};

const init = async () => {
  try {
    PublishLog("Build Started...");

    const outDirPath = path.join(__dirname, "output");
    new Promise((resolve) => setTimeout(resolve, 2000));

    if (!fs.existsSync(outDirPath)) {
      throw new Error(
        `Output directory not found: ${outDirPath}. Git clone may have failed.`
      );
    }

    const p = exec(`cd ${outDirPath} && bun install && bun run build`);

    p.stdout?.on("data", async (data) => {
      const output = data.toString();
      PublishLog(`Build Output: ${output}`, "INFO");
    });

    p.stderr?.on("data", async (data) => {
      const output = data.toString();
      PublishLog(`Build Warning: ${output}`, "WARN");
    });

    p.on("close", async (code) => {
      PublishLog(
        `Build completed with exit code: ${code}`,
        code === 0 ? "INFO" : "ERROR"
      );

      if (code !== 0) {
        console.error(`Build failed with exit code: ${code}`);
        process.exit(1);
        return;
      }

      try {
        const distFolderPath = path.join(outDirPath, "dist");
        if (!fs.existsSync(distFolderPath))
          throw new Error("Build folder not found: " + distFolderPath);

        const distFolderContent = fs.readdirSync(distFolderPath, {
          recursive: true,
        });
        const files = distFolderContent.filter(
          (file): file is string => typeof file === "string"
        );

        for (const file of files) {
          try {
            PublishLog(`Starting upload: ${file}`, "INFO");

            const absoluteFilePath = path.join(distFolderPath, file);
            if (fs.lstatSync(absoluteFilePath).isDirectory()) continue;

            const fileStats = fs.statSync(absoluteFilePath);
            const fileBody =
              fileStats.size < 5 * 1024 * 1024
                ? fs.readFileSync(absoluteFilePath)
                : fs.createReadStream(absoluteFilePath);

            const command = new PutObjectCommand({
              Bucket: bucket,
              Key: `__outputs/${PROJECT_ID}/${file}`,
              Body: fileBody,
              ContentType:
                mime.getType(absoluteFilePath) || "application/octet-stream",
            });

            s3Client.send(command);
            PublishLog(`Successfully uploaded: ${file}`, "INFO");
          } catch (uploadError) {
            PublishLog(
              `Upload error for ${file}: ${uploadError}`,
              "ERROR"
            );
          }
        }

        PublishLog("All files uploaded successfully!", "INFO");
        process.exit(0);
      } catch (distError) {
        PublishLog(`Error processing dist folder: ${distError}`, "ERROR");
        process.exit(1);
      }
    });
  } catch (err) {
    PublishLog(`Init function error: ${err}`, "ERROR");
    process.exit(1);
  }
};

init();
