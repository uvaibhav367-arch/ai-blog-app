import { connectDatabase } from '../server/src/db/connect.js';
import { createPostRepository } from '../server/src/repositories/index.js';
import { createApp } from '../server/src/app.js';
import { config } from '../server/src/config/env.js';

let driver = 'memory';

if (config.mongoUri && !config.useMemoryStore) {
  const connected = await connectDatabase();
  if (connected) driver = 'mongo';
}

const repository = createPostRepository({ driver, seed: true });
repository.driver = driver;

const app = createApp(repository);

export default app;
