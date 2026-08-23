import mongoose from "mongoose";
import dns from "dns";
import crypto from "crypto";
import User from "../models/User.Model.js";

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

    // Auto-ensure Admin User exists in whatever database is connected
    try {
      const adminEmail = "admin@gmail.com";
      const adminPassword = "admin1234";

      const adminUser = await User.findOne({ email: adminEmail });
      if (!adminUser) {
        const salt = crypto.randomBytes(16);
        const hashedPassword = await new Promise((resolve, reject) => {
          crypto.pbkdf2(adminPassword, salt, 310000, 32, "sha256", (err, key) => {
            if (err) reject(err);
            else resolve(key);
          });
        });

        await User.create({
          name: "ShopKart Admin",
          email: adminEmail,
          password: hashedPassword,
          salt: salt,
          role: "admin",
          phoneNumber: "9999999999",
          addresses: [],
        });
        console.log("Auto-seeded admin user: admin@gmail.com / admin1234");
      }
    } catch (seedErr) {
      console.log("Admin auto-seed notice:", seedErr.message);
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export default connectDB;
