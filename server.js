import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ideaRouter from './routes/ideaRoutes.js';
import authRouter from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/ideas', ideaRouter);
app.use('/api/auth', authRouter);

// 404 Fallback
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
