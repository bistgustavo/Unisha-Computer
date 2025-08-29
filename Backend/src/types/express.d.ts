// src/types/express.d.ts
import { User, WebRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        username: string;
        email: string;
        web_role: WebRole;
      };
    }
  }
}
