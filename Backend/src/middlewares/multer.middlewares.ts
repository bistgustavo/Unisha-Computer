import multer from "multer";
import { Request } from "express";
import path from "path";

type DestinationCallBack = (error: Error | null, destination: string) => void;
type FileNameCallBack = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallBack
  ) => {
    cb(null, "./public/temp");
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallBack) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage });
