import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./config/prisma";
import submissionsRouter from "./routes/submissions";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";  // ← Add this
import accessRequestsRouter from "./routes/access-requests";  // ← Add this

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/submissions", submissionsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);  // ← Add this
app.use("/api/access-requests", accessRequestsRouter);  // ← Add this

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