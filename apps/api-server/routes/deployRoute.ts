import { prismaClient } from "@repo/prisma-store";
import * as k8s from "@kubernetes/client-node";
import express from "express";
import z from "zod";

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.BUCKET;

if (!secretAccessKey || !accessKeyId || !endpoint || !bucket) {
  throw new Error("Missing required environment variables: S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT, BUCKET");
}

const deployRoute = express.Router();

deployRoute.post("/", async (req, res) => {
  const schema = z.object({
    projectId: z.string(),
  });

  const parsedData = schema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).send({
      message: "Invalid Input Data",
      Error: parsedData.error.format(),
    });
    return;
  }

  console.log("Endpoint is : ", endpoint);

  try {
    const { projectId } = parsedData.data;

    const project = await prismaClient.project.findUnique({ where: { id: projectId } });

    if (!project) {
      res.status(400).send({ message: "Project not found" });
      return;
    }
    // project is guaranteed non-null here
    const gitUrl = project.gitUrl;
    const thisProjectId = projectId;

    const deployment = await prismaClient.deployment.create({
      data: {
        project: { connect: { id: projectId } },
        status: "QUEUED",
      },
    });

    if (!deployment) {
      res.status(400).send({ message: "Error creating deployment" });
      return;
    }

    // Mark as in progress
    await prismaClient.deployment.update({
      where: { id: deployment.id },
      data: { status: "IN_PROGRESS" },
    });

    res.status(200).json({
      status: "queued",
      data: { projectId, deploymentId: deployment.id },
    });

    // ---- Kubernetes pod creation ----
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const podName = `build-${projectId}`;

  const podManifest = {
      metadata: { name: podName },
      spec: {
        containers: [
          {
            name: "build-server",
            image: "waqarhasan/build-server:v2",
            env: [
              { name: "GIT_REPOSITORY_URL", value: gitUrl },
              { name: "PROJECT_ID", value: thisProjectId },
              { name: "DEPLOYMENT_ID", value: deployment.id },
              { name: "S3_ACCESS_KEY_ID", value: accessKeyId },
              { name: "S3_SECRET_ACCESS_KEY", value: secretAccessKey },
              { name: "S3_ENDPOINT", value: endpoint },
              { name: "BUCKET", value: bucket },
              { name: "DATABASE_URL", value: process.env.DATABASE_URL || "" },
            ],
          },
        ],
        restartPolicy: "Never",
      },
    };

    console.log("Creating the pod...");
    await k8sApi.createNamespacedPod({ namespace: "default", body: podManifest });
    console.log("Pod created successfully");

    // ---- Pod monitoring ----
    let completed = false;
    let attempts = 0;
    const maxAttempts = 120;

    while (!completed && attempts < maxAttempts) {
      try {
        const podResponse = await k8sApi.readNamespacedPod({
          name: podName,
          namespace: "default",
        });

        const phase = podResponse.status?.phase;
        const containerStatuses = podResponse.status?.containerStatuses;
        console.log(`Pod : ${podName} , status : ${phase}`);

        const buildContainer = containerStatuses?.find(
          (c) => c.name === "build-server"
        );

        const isTerminated = buildContainer?.state?.terminated;
        if (phase === "Succeeded" || phase === "Failed" || isTerminated) {
          completed = true;
          const exitCode = isTerminated?.exitCode;
          const reason = isTerminated?.reason || phase;

          console.log(
            `Pod ${podName} completed - Phase: ${phase}, Exit Code: ${exitCode}, Reason: ${reason}`
          );

          const finalStatus = exitCode === 0 ? "READY" : "FAIL";
          await prismaClient.deployment.update({
            where: { id: deployment.id },
            data: { status: finalStatus },
          });

          // Cleanup
          try {
            await k8sApi.deleteNamespacedPod({
              name: podName,
              namespace: "default",
            });
            console.log(`Pod ${podName} deleted successfully`);
          } catch (deleteError) {
            console.error(`Error deleting pod: ${deleteError}`);
          }
        } else {
          await new Promise((r) => setTimeout(r, 5000));
        }
      } catch (error) {
        console.error(`Error checking pod status: ${error}`);
        await new Promise((r) => setTimeout(r, 5000));
      }
      attempts++;
    }

    if (!completed) {
      console.log(
        `Pod ${podName} did not complete within timeout, attempting cleanup`
      );

      try {
        await k8sApi.deleteNamespacedPod({
          name: podName,
          namespace: "default",
        });
      } catch (error) {
        console.error(`Error cleaning up pod: ${error}`);
      }
    }
  } catch (error) {
    console.error("Error in /deploy endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { deployRoute };
