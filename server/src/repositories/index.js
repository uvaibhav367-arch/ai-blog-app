import { createMongoPostRepository } from './mongoPostRepository.js';
import { createMemoryPostRepository } from './memoryPostRepository.js';

export function createPostRepository({ driver, seed = true }) {
  if (driver === 'mongo') {
    return createMongoPostRepository();
  }
  return createMemoryPostRepository({ seed });
}
