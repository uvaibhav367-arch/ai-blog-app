import { config } from '../server/src/config/env.js';

export default function handler(req, res) {
  res.status(200).json({
    success: true,
    name: 'AI Blog API',
    version: '1.0.0',
    environment: config.nodeEnv,
    docs: [
      'GET    /api/posts',
      'GET    /api/posts/:id',
      'POST   /api/posts',
      'PUT    /api/posts/:id',
      'DELETE /api/posts/:id',
      'POST   /api/generate',
      'GET    /api/health',
    ],
  });
}
