import { Request, Response } from "express";
import { PORT } from "./secrets";
import { app } from "./app";
import { connectDB } from "./db/index";

const port = PORT || 3001;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error ) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
