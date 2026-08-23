import connectDB from "./utils/connectDB.js";
import User from "./models/User.Model.js";
import dotenv from "dotenv";

dotenv.config();

async function promoteToAdmin() {
  await connectDB();
  const result = await User.updateMany(
    { email: { $in: ["srujanhiremath519@gmail.com", "admin@shopkart.com", "admin@gmail.com"] } },
    { $set: { role: "admin" } }
  );
  console.log("Updated admin roles:", result);
  process.exit(0);
}

promoteToAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
