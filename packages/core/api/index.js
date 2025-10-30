import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';

const app = express();
app.use(cors());
app.use(express.json({limit: '1mb'}));

// Here we check the health
app.get('/health', (_req, res) => {
    res.json({ ok: true, service: '@chatapp/api', time: new Date().toISOString() });
});

// API routes (We'll call this fron the UI)
app.use('/rag/chat', chatRouter);

app.listen(process.env.PORT || 8787, '0.0.0.0', () => {
  console.log(`[api] listening on http://localhost:${process.env.PORT || 8787}`);
});
