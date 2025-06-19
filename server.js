import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ideaRouter from './routes/ideaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/ideas', ideaRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
