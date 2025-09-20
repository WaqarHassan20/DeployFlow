import express from "express";
import z from "zod";
import { prismaClient } from "@repo/prisma-store";

const userRoute = express.Router();

// Get all users with their project counts and last session info
userRoute.get("/", async (req, res) => {
  try {
    const users = await prismaClient.user.findMany({
      include: {
        sessions: {
          orderBy: { expires: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform the data to include calculated fields
    const transformedUsers = users.map(user => {
      const lastSession = user.sessions[0];
      
      // Determine user status based on last session
      let status = 'offline';
      let lastActive = 'Never';
      
      if (lastSession) {
        const now = new Date();
        const sessionExpiry = new Date(lastSession.expires);
        const timeDiff = now.getTime() - sessionExpiry.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        
        if (sessionExpiry > now) {
          // Session is still valid
          if (minutesDiff <= 5) {
            status = 'active';
            lastActive = 'Just now';
          } else if (minutesDiff <= 60) {
            status = 'away';
            lastActive = `${minutesDiff} minutes ago`;
          }
        } else {
          // Session expired
          if (minutesDiff <= 1440) { // Less than 24 hours
            const hoursDiff = Math.floor(minutesDiff / 60);
            if (hoursDiff < 1) {
              lastActive = `${minutesDiff} minutes ago`;
            } else {
              lastActive = `${hoursDiff} hours ago`;
            }
          } else {
            const daysDiff = Math.floor(minutesDiff / 1440);
            lastActive = `${daysDiff} days ago`;
          }
        }
      }

      // Generate avatar initials
      const avatar = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : user.email && user.email.length > 0
          ? (user.email[0] ?? "".toUpperCase())
          : "U";

      return {
        id: user.id,
        name: user.name || user.email?.split('@')[0] || 'Unknown User',
        email: user.email,
        role: 'Developer', // Default role, you can extend this later
        status,
        lastActive,
        joinDate: user.createdAt.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        avatar
      };
    });

    res.status(200).json({ 
      message: 'success', 
      data: transformedUsers 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
});

// Get user by email
userRoute.get("/email/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const user = await prismaClient.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'success', data: user });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Failed to fetch user', error });
  }
});

// Delete account (delete user and all related data)
userRoute.post('/delete-account', async (req, res) => {
  const schema = z.object({
    userId: z.string().optional(),
    confirm: z.boolean().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid request body', error: parsed.error.format() });
  }

  const { userId } = parsed.data;

  try {
    let targetUserId = userId;

    // If no userId provided, try to derive user from session token in Authorization header
    if (!targetUserId) {
      const auth = req.headers.authorization;
      if (!auth) {
        return res.status(401).json({ message: 'No userId provided and no Authorization header present' });
      }

      const token = auth.replace(/^Bearer\s+/i, "");
      if (!token) {
        return res.status(401).json({ message: 'Invalid Authorization header' });
      }

      // Find session in DB
      const session = await prismaClient.session.findUnique({ where: { sessionToken: token } });
      if (!session) return res.status(401).json({ message: 'Session not found' });
      targetUserId = session.userId;
    }

    // Final check: ensure user exists
    const user = await prismaClient.user.findUnique({ where: { id: targetUserId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete the user - cascade rules in Prisma schema will remove accounts, sessions, projects, deployments, logs
    await prismaClient.user.delete({ where: { id: targetUserId } });

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error });
  }
});

export { userRoute };
