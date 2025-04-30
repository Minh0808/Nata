// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { sequelize } from './config/db';
import userRoutes from './routes/users';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Server hoạt động');
});
app.use('/api/users', userRoutes);

// --- 1) Sync DB một lần ở cold start ---
let isDbSynced = false;
const initDb = async () => {
  if (isDbSynced) return;
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync({ alter: true });
    console.log('Database synced (alter: true)');
    isDbSynced = true;
  } catch (err) {
    console.error('Kết nối DB lỗi:', err);
  }
};
// Middleware gọi initDb() trước mọi route
app.use(async (_req, _res, next) => {
  await initDb();
  next();
});

// --- 2) Chạy local khi dev ---
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`🟢 Server local tại http://localhost:${port}`);
  });
}

// --- 3) Export handler cho môi trường serverless ---
export const handler = serverless(app);
