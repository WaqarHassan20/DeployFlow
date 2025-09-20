import { prismaClient } from "@repo/prisma-store";
import express from "express";
import z from "zod";

const projectRoute = express.Router();

// Create a new project
projectRoute.post("/", async (req, res) => {
  const schema = z.object({
    userId: z.string(),
    name: z.string(),
    gitUrl: z.string(),
    description: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', error: parsed.error.format() });
  }
  const { userId, name, gitUrl, description } = parsed.data;
  try {
    const project = await prismaClient.project.create({
      data: { userId, name, gitUrl, description },
    });
    return res.status(201).json({ message: 'success', data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ message: 'Failed to create project', error });
  }
});

projectRoute.get("/", async (req, res) => {
  try {
    const projects = await prismaClient.project.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ message: 'success', data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects', error });
  }
});

// Get a single project by ID and include its deployments
projectRoute.get("/:id", async (req, res) => {
  try {
    const project = await prismaClient.project.findUnique({
      where: { id: req.params.id },
      include: { deployment: true }
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'success', data: project });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: 'Failed to fetch project', error });
  }
});

export { projectRoute };
