import { config } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './db/connect.js';
import { createPostRepository } from './repositories/index.js';
import { createApp } from './app.js';

async function bootstrap() {
  const connected = config.mongoUri ? await connectDatabase() : false;
  const driver = connected && !config.useMemoryStore ? 'mongo' : 'memory';

  const repository = createPostRepository({ driver, seed: true });
  repository.driver = driver;

  const app = createApp(repository);

  const server = app.listen(config.port, () => {
    console.log(`[server] listening on http://localhost:${config.port}`);
    console.log(`[server] post store driver: ${driver}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('[server] failed to start', error);
  process.exit(1);
});
