// src/types/express.d.ts
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        username: string;
        email: string;
      };
    }
  }
}
