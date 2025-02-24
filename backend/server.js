import express from 'express';
import cors from 'cors';
import wordController from './controllers/word.controller.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

app.use('/api/words', wordController);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});