import { Router } from 'express';
import { createPostController } from '../controllers/postController.js';

export function createPostRouter(repository) {
  const router = Router();
  const controller = createPostController(repository);

  router.get('/', controller.list);
  router.post('/', controller.create);
  router.get('/:id', controller.getOne);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
