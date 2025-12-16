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

// Simple CORS - allow Vercel and localhost
app.use(cors({
  origin: true, // Allow all origins for now (we'll restrict later)
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