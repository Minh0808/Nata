import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { auth } from '../middleware/auth';
import { mustRole } from '../middleware/role';

dotenv.config();
const router = Router();

const JWT_SECRET     = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN);

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: 'Sai Email hoặc không có đăng ký' });
        return;
      }
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        res.status(401).json({ message: 'Sai mật khẩu' });
        return;
      }
      const payload = { user_id: user.user_id, role: user.role };
      const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
      const token = jwt.sign(payload, JWT_SECRET, options);
      res.json({
        token,
        user: {
          user_id: user.user_id,
          name:    user.name,
          email:   user.email,
          role:    user.role
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/',
  auth,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await User.findAll({
        attributes: ['user_id', 'name', 'email', 'role']
      });
      res.json(list);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/',
  auth,
  mustRole('admin'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('→ [CREATE USER] payload:', req.body);

    try {
      const { user_id, name, email, password, role } = req.body;

      const existById = await User.findOne({ where: { user_id } });
      if (existById) {
        console.error(`✋ duplicate user_id: ${user_id}`);
        res.status(400).json({ message: `User ID '${user_id}' đã tồn tại.` });
        return;
      }

      const existByEmail = await User.findOne({ where: { email } });
      if (existByEmail) {
        console.error(`✋ duplicate email: ${email}`);
        res.status(400).json({ message: `Email '${email}' đã được đăng ký.` });
        return;
      }

      const hash = await bcrypt.hash(password, 10);
      const created = await User.create({ user_id, name, email, password: hash, role });
      console.log('user created:', created.toJSON());

      res.status(201).json({
        user_id: created.user_id,
        name:    created.name,
        email:   created.email,
        role:    created.role,
      });
    } catch (err: any) {
      console.error('[CREATE USER] error:', err.stack || err.message);
      next(err);
    }
  }
);

router.put(
  '/:id',
  auth,
  mustRole('admin'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const oldId = req.params.id;
      const { user_id, name, email, password, role } = req.body;

      if (user_id && user_id !== oldId) {
        const exists = await User.findOne({ where: { user_id } });
        if (exists) {
          res.status(400).json({ message: `User ID '${user_id}' đã tồn tại.` });
          return;
        }
      }

      const updates: Partial<Pick<User, 'user_id' | 'name' | 'email' | 'password' | 'role'>> = {
        name,
        email,
        role,
      };

      if (user_id && user_id !== oldId) {
        updates.user_id = user_id;
      }

      if (password) {
        updates.password = await bcrypt.hash(password, 10);
      }

      const [affected] = await User.update(
        updates as any,
        { where: { user_id: oldId } }
      );

      if (affected === 0) {
        res.status(404).json({ message: 'User không tồn tại' });
        return;
      }

      res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:id',
  auth,
  mustRole('admin'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const deletedCount = await User.destroy({ where: { user_id: userId } });

      if (deletedCount === 0) {
        res.status(404).json({ message: 'User không tồn tại' });
        return;
      }

      res.json({ message: 'Xóa thành công' });
      return;
    } catch (err) {
      console.error('delete-user error:', err);
      next(err);
    }
  }
);

export default router;
