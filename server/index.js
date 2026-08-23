import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import session from "express-session";
import passport from "passport";
import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import ProductRouter from "./routes/Product.Routes.js";
import BrandRouter from "./routes/Brand.Routes.js";
import CategoryRouter from "./routes/Category.Routes.js";
import UserRouter from "./routes/User.Routes.js";
import AuthRouter from "./routes/Auth.Routes.js";
import MailRouter from "./routes/Mail.Routes.js";
import CartRouter from "./routes/Cart.Routes.js";
import OrderRouter from "./routes/Order.Routes.js";
import PaymentRouter from "./routes/Payment.Routes.js";
import User from "./models/User.Model.js";
import {
  cookiesExtractor,
  isAuthenticated,
  sanitizeUser,
} from "./services/Common.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "shopkart_jwt_secret_key_2026";
const SESSION_SECRET = process.env.SESSION_SECRET || "shopkart_session_secret_key_2026";
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      return callback(null, origin);
    },
    credentials: true,
  })
);

// Auto-connect to DB for every request (Serverless friendly)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    console.error("DB middleware error:", e);
  }
  next();
});

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("build"));
app.use(cookieParser());

const opts = {
  jwtFromRequest: cookiesExtractor,
  secretOrKey: JWT_SECRET,
};

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/products", isAuthenticated, ProductRouter);
app.use("/brands", isAuthenticated, BrandRouter);
app.use("/category", isAuthenticated, CategoryRouter);
app.use("/users", isAuthenticated, UserRouter);
app.use("/auth", AuthRouter);
app.use("/mail", MailRouter);
app.use("/cart", isAuthenticated, CartRouter);
app.use("/orders", isAuthenticated, OrderRouter);
app.use("/payment", isAuthenticated, PaymentRouter);

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const cleanEmail = email ? email.trim().toLowerCase() : "";
      const user = await User.findOne({
        email: { $regex: new RegExp("^" + cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i") },
      });

      if (!user || !user.salt || !user.password) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) {
            return done(err);
          }
          try {
            const userPasswordBuf = Buffer.isBuffer(user.password)
              ? user.password
              : Buffer.from(user.password);

            if (
              userPasswordBuf.length !== hashedPassword.length ||
              !crypto.timingSafeEqual(userPasswordBuf, hashedPassword)
            ) {
              return done(null, false, {
                message: "Incorrect email or password",
              });
            } else {
              const token = jwt.sign(sanitizeUser(user), JWT_SECRET, {
                expiresIn: "24h",
              });

              return done(null, { id: user.id, role: user?.role, token });
            }
          } catch (e) {
            return done(null, false, { message: "Incorrect email or password" });
          }
        }
      );
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user?.role,
    });
  });
});

connectDB();

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
