import { PrismaClient } from "./generated/prisma";

// export const prismaClient = new PrismaClient();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prismaClient = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient ;
