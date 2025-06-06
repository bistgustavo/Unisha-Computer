import express, {
  Express,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
import { CORS_ORIGIN } from "./secrets";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";

const app: Express = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//common middlewares

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import UserRouter from "./routes/user.routes";
import { ApiError } from "./utils/ApiError";

//Routes
app.use("/api/v2/user", UserRouter);

//error handler middleware

app.use(
  (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running! 🚀");
});

export { app };
