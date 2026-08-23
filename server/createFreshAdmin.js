import connectDB from "./utils/connectDB.js";
import User from "./models/User.Model.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

async function createFreshAdmin() {
  await connectDB();

  const email = "admin@gmail.com";
  const password = "admin1234";

  await User.deleteMany({ email });

  const salt = crypto.randomBytes(16);

  crypto.pbkdf2(
    password,
    salt,
    310000,
    32,
    "sha256",
    async function (err, hashedPassword) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      const adminUser = await User.create({
        name: "ShopKart Admin",
        email: email,
        password: hashedPassword,
        salt: salt,
        role: "admin",
        phoneNumber: "9999999999",
        addresses: [],
      });

      console.log(`FRESH_ADMIN_CREATED: Email=${email}, Password=${password}, Role=${adminUser.role}`);
      process.exit(0);
    }
  );
}

createFreshAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
