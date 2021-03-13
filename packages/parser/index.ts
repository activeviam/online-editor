import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";

import grammarRouter from "./routes/grammarRoutes";

dotenv.config();
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

// Constants

const PORT = process.env.PORT === undefined ? 5000 : process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const COOKIE_MAXAGE =
  process.env.COOKIE_MAXAGE === undefined
    ? 3600000
    : parseInt(process.env.COOKIE_MAXAGE);
const app = express();

// Middlewares

app.use(
  cors({
    credentials: true,
  }),
);

app.use(bodyParser.json());

app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    name: "custom-ide",
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: false,
      maxAge: COOKIE_MAXAGE,
    },
    store: new RedisStore({ client: redisClient, ttl: 86400 }),
    resave: false,
  }),
);

app.use((req, res, next) => {
  console.log(req.session, req.sessionID);
  next();
});

// Routes

app.use("/grammar", grammarRouter);

// Start server

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
