import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import narrativeRouter from './routes/narrative.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/narrative', narrativeRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set. Narrative endpoints will fail.');
  }
});
