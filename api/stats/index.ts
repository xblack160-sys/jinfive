// Real-time visitor and platform statistics API for Vercel Serverless
let memoryStats = {
  totalVisitors: 14382,
  enrolledStudents: 1420,
  activeSessions: new Map<string, number>()
};

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const now = Date.now();

  // Prune expired sessions (older than 60 seconds)
  for (const [id, lastSeen] of memoryStats.activeSessions.entries()) {
    if (now - lastSeen > 60000) {
      memoryStats.activeSessions.delete(id);
    }
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const { sessionId, isNewVisit, hasEnrolled } = body;

      if (sessionId) {
        memoryStats.activeSessions.set(sessionId, now);
      }

      if (isNewVisit) {
        memoryStats.totalVisitors += 1;
      }

      if (hasEnrolled) {
        memoryStats.enrolledStudents += 1;
      }
    } catch {
      // ignore parse errors
    }
  }

  const onlineUsers = Math.max(1, memoryStats.activeSessions.size || 1);

  return res.status(200).json({
    totalVisitors: memoryStats.totalVisitors,
    onlineUsers: onlineUsers,
    enrolledStudents: memoryStats.enrolledStudents,
    timestamp: now
  });
}
