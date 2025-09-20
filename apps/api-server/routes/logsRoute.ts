import express from "express";
import { prismaClient } from "@repo/prisma-store";

const logsRoute = express.Router();

// Fetch logs for a given deployment
logsRoute.get("/:id", async (req, res) => {
  try {
    const deploymentId = req.params.id;

    const logs = await prismaClient.log.findMany({
      where: { deploymentId },
      orderBy: { timestamp: "asc" }, // keeps logs in chronological order
    });

    res.status(200).json({
      logs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export { logsRoute };
