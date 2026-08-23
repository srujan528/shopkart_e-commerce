import mongoose from "mongoose";
import dns from "dns";

// Fix for Node.js c-ares DNS resolver on Windows when querying MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URL;
    const options = process.env.DB_NAME ? { dbName: process.env.DB_NAME } : {};
    
    await mongoose.connect(mongoUri, options);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export default connectDB;
