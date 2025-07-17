import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/ApiError';

// Extend Express Request interface to include guestId
declare module 'express-serve-static-core' {
  interface Request {
    guestId?: string;
  }
}

export const handleGuestId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip if user is authenticated
    if (req.user?.user_id) return next();

    let guestId = req.cookies?.guestId;
    
    if (!guestId) {
      guestId = `guest_${uuidv4()}`;
      res.cookie('guestId', guestId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiration
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    }

    req.guestId = guestId;
    next();
  } catch (error) {
    next(new ApiError(500, 'Failed to initialize guest session'));
  }
};