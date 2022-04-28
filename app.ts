import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './routes/user.route.js';
import { errorHandler } from './utils/errors.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_HOST || 'http://localhost:3000',
}));

app.use('/user', userRouter);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Severs is running on ${PORT}!`);
});
