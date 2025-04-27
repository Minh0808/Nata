import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export interface AuthRequest extends Request {
  user?: { user_id: string; role: string };
}

export function auth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ message: 'Token không tồn tại.' });
    return;
  }
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Định dạng token không hợp lệ.' });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { user_id: string; role: string };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ.' });
    return;
  }
}
