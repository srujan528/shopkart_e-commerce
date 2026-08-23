import mongoose from "mongoose";
import dns from "dns";

// Fix for Node.js c-ares DNS resolver on Windows when querying MongoDB Atlas SRV records
if (process.platform === "win32") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (e) {
    console.log("DNS setServers notice:", e.message);
  }
}

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const mongoUri =
      process.env.MONGO_URL ||
      process.env.MONGODB_URL ||
      process.env.DATABASE_URL ||
      "mongodb+srv://srujanhiremath519_db_user:srujan%40123@placementportal.rkhdyck.mongodb.net/shopkart?appName=PlacementPortal";

    const options = process.env.DB_NAME ? { dbName: process.env.DB_NAME } : {};

    await mongoose.connect(mongoUri, options);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export default connectDB;
