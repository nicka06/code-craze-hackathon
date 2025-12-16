import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./config/prisma";
import submissionsRouter from "./routes/submissions";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import accessRequestsRouter from "./routes/access-requests";
import schedulerRouter from "./routes/scheduler";

dotenv.config();
const app = express();

// Allow requests from frontend (including Vercel preview URLs)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  /\.vercel\.app$/, // Allow all Vercel preview URLs
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/submissions", submissionsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/access-requests", accessRequestsRouter);
app.use("/api/scheduler", schedulerRouter);

const PORT = process.env.PORT || 4000;

// Health check endpoint
app.get("/", async (req: Request, res: Response) => {
    try {
        await prisma.$connect();
        const accountCount = await prisma.account.count();
        
        res.json({
            message: "Tattle News API",
            status: "healthy",
            database: "connected",
            tables: {
                accounts: accountCount,
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            message: "Health check failed",
            database: "disconnected",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});