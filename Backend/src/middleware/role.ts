import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export function mustRole(requiredRole: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }
    if (req.user.role !== requiredRole) {
      res.status(403).json({ message: 'Forbidden.' });
      return;
    }
    next();
  };
}
