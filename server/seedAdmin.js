import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "./models/User.Model.js";
import connectDB from "./utils/connectDB.js";

dotenv.config();

async function createAdminUser() {
  await connectDB();

  const adminEmail = "admin@shopkart.com";
  const adminPassword = "AdminPassword123!";

  let existingUser = await User.findOne({ email: adminEmail });
  if (existingUser) {
    existingUser.role = "admin";
    await existingUser.save();
    console.log(`ADMIN_USER_UPDATED: Email=${adminEmail}, Password=${adminPassword}, Role=admin`);
    process.exit(0);
  }

  const salt = crypto.randomBytes(16);

  crypto.pbkdf2(
    adminPassword,
    salt,
    310000,
    32,
    "sha256",
    async function (err, hashedPassword) {
      if (err) {
        console.error("Password hash error:", err);
        process.exit(1);
      }

      const adminUser = await User.create({
        name: "ShopKart Admin",
        email: adminEmail,
        password: hashedPassword,
        salt: salt,
        role: "admin",
        phoneNumber: "9999999999",
        addresses: [],
      });

      console.log(`ADMIN_USER_CREATED: Email=${adminEmail}, Password=${adminPassword}, Role=admin, ID=${adminUser._id}`);
      process.exit(0);
    }
  );
}

createAdminUser().catch((err) => {
  console.error(err);
  process.exit(1);
});
