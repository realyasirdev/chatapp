import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    if (error.message.includes("querySrv ECONNREFUSED")) {
      console.log("👉 Tip: This often means your network is blocking SRV records. Try checking your DNS settings or using a standard connection string.");
    }
    console.log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};
