import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './routes/user.route.js';
import { errorHandler } from './utils/errors.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_HOST,
}));

app.use('/user', userRouter);

app.use(errorHandler);

app.listen(Number(process.env.PORT) || 3001, '127.0.0.1', () => {
  console.log('The server is listening on http://localhost:3001');
});
