import express from 'express';
import cors from 'cors';
import KosRouter from './routes/kosRoute.js';
import UserRouter from './routes/userRoute.js';
import KosImageRouter from './routes/kosImageRoute.js';
import association from './config/assoc.js';
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));


app.use(KosRouter);
app.use(UserRouter);
app.use(KosImageRouter);

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

association();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});