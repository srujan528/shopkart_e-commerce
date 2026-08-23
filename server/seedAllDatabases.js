import dns from "dns";
import mongoose from "mongoose";
import crypto from "crypto";
import User from "./models/User.Model.js";

if (process.platform === "win32") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const dbUris = [
  "mongodb+srv://srujanhiremath519_db_user:srujan%40123@placementportal.rkhdyck.mongodb.net/shopkart?appName=PlacementPortal",
  "mongodb+srv://srujan:srujan528@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority"
];

const email = "admin@gmail.com";
const password = "admin1234";

async function seedDatabase(uri) {
  try {
    const conn = await mongoose.createConnection(uri, { dbName: "shopkart" }).asPromise();
    console.log(`Connected to: ${uri.split("@")[1]}`);

    const UserModel = conn.model("User", User.schema);
    await UserModel.deleteMany({ email: { $in: [email, "admin@shopkart.com", "srujanhiremath519@gmail.com"] } });

    const salt = crypto.randomBytes(16);
    const hashedPassword = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });

    await UserModel.create({
      name: "ShopKart Admin",
      email: email,
      password: hashedPassword,
      salt: salt,
      role: "admin",
      phoneNumber: "9999999999",
      addresses: [],
    });

    console.log(`ADMIN_SEEDED_SUCCESS for ${uri.split("@")[1]}: email=${email}, password=${password}`);
    await conn.close();
  } catch (err) {
    console.error(`Error seeding ${uri.split("@")[1]}:`, err.message);
  }
}

async function run() {
  for (const uri of dbUris) {
    await seedDatabase(uri);
  }
  process.exit(0);
}

run();
