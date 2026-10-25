import express, { type Express } from "express";
import cors, { type CorsOptions } from "cors";
import pinoHttp from "pino-http";
import router from "./routes/index";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    const configuredOrigin = process.env.CORS_ORIGIN;
    if (configuredOrigin && configuredOrigin !== "*") {
      const allowedList = configuredOrigin.split(",").map((s) => s.trim());
      if (allowedList.includes(origin)) {
        return callback(null, true);
      }
    }

    // Check for localhost, 127.0.0.1, and Cloudflare domains (*.pages.dev, *.workers.dev, *.trycloudflare.com)
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isCloudflare = /^https?:\/\/([a-zA-Z0-9-]+\.)*(pages\.dev|workers\.dev|trycloudflare\.com)$/.test(origin);

    if (isLocalhost || isCloudflare || !configuredOrigin || configuredOrigin === "*") {
      return callback(null, true);
    }

    // Reject unapproved origins
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type", "Accept"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

app.use("/api", router);

export default app;
