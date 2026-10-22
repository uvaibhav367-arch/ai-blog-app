import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { createPostRouter } from './routes/postRoutes.js';
import { createAiRouter } from './routes/aiRoutes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

export function createApp(repository) {
  const app = express();

  app.use(
    cors({
      origin: config.clientOrigin === '*' ? true : config.clientOrigin.split(','),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      status: 'ok',
      driver: repository.driver,
      uptime: Math.round(process.uptime()),
    });
  });

  app.use('/api/posts', createPostRouter(repository));
  app.use('/api', createAiRouter());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
