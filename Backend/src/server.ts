import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    await sequelize.sync({ alter: true });
    console.log('Database synced (alter: true)');

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server hoạt động tại http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Kết nối DB lỗi:', err);
  }
})();
