import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { crawlByuCatalog } from '../scripts/crawl_byu_catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API: Trigger BYU catalog crawler
app.post('/api/crawl', async (req, res) => {
  try {
    const courses = await crawlByuCatalog();
    res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    console.error('Error during catalog crawl:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// API: Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'BYU ChemE Graduation Planner Server' });
});

// Serve frontend build static files in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.send('Server is running. Run `npm run build` to build the frontend assets.');
  }
});

app.listen(PORT, () => {
  console.log(`⚡ BYU Chemical Engineering Graduation Planner server running on http://localhost:${PORT}`);
});
