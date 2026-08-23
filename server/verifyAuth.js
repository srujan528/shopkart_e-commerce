import dns from "dns";
import mongoose from "mongoose";
import crypto from "crypto";
import User from "./models/User.Model.js";
import connectDB from "./utils/connectDB.js";

if (process.platform === "win32") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

async function testAuth() {
  await connectDB();

  const email = "admin@gmail.com";
  const password = "admin1234";

  const user = await User.findOne({ email: email });
  console.log("User found:", user ? user.email : "NOT FOUND");

  if (!user) {
    process.exit(1);
  }

  console.log("user.password isBuffer:", Buffer.isBuffer(user.password), "length:", user.password.length);
  console.log("user.salt isBuffer:", Buffer.isBuffer(user.salt), "length:", user.salt.length);

  crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", (err, hashedPassword) => {
    if (err) console.error("pbkdf2 error:", err);
    console.log("hashedPassword isBuffer:", Buffer.isBuffer(hashedPassword), "length:", hashedPassword.length);

    const match = crypto.timingSafeEqual(user.password, hashedPassword);
    console.log("TIMING_SAFE_EQUAL MATCH:", match);
    process.exit(0);
  });
}

testAuth().catch((e) => {
  console.error(e);
  process.exit(1);
});
