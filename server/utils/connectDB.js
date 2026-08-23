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

const PRIMARY_ATLAS_URI =
  "mongodb+srv://srujanhiremath519_db_user:srujan%40123@placementportal.rkhdyck.mongodb.net/shopkart?appName=PlacementPortal";

let isConnectingPromise = null;

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (isConnectingPromise) {
    await isConnectingPromise;
    return;
  }

  isConnectingPromise = (async () => {
    const envUri =
      process.env.MONGO_URL ||
      process.env.MONGODB_URL ||
      process.env.DATABASE_URL;

    const mongoUri =
      envUri && envUri.startsWith("mongodb") ? envUri : PRIMARY_ATLAS_URI;

    try {
      await mongoose.connect(mongoUri, {
        dbName: "shopkart",
        serverSelectionTimeoutMS: 8000,
      });
      console.log("Connected to MongoDB Atlas");
    } catch (error) {
      console.error("Primary connection error, retrying Atlas fallback:", error.message);
      try {
        await mongoose.connect(PRIMARY_ATLAS_URI, {
          dbName: "shopkart",
          serverSelectionTimeoutMS: 8000,
        });
        console.log("Connected to Fallback MongoDB Atlas");
      } catch (fallbackError) {
        console.error("MongoDB fallback connection error:", fallbackError.message);
        return;
      }
    }

    // Auto-ensure Admin User exists in connected database
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
  })();

  try {
    await isConnectingPromise;
  } finally {
    isConnectingPromise = null;
  }
}

export default connectDB;
