
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import { createServer } from "http";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { initSocket } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const httpServer = createServer(app);

// Init Socket.IO
initSocket(httpServer);

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");
  console.log("🚀 Production Mode: Serving frontend from", frontendDistPath);

  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Start
httpServer.listen(PORT, () => {
  console.log("✅ Server running on PORT: " + PORT);
  connectDB();
});
