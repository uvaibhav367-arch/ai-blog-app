import dotenv from 'dotenv';

dotenv.config();

const toBool = (value) => value === 'true' || value === '1';

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  useMemoryStore: toBool(process.env.USE_MEMORY_STORE),
  seeding: toBool(process.env.SEED_SAMPLE_POSTS),
};

export const isProduction = config.nodeEnv === 'production';
