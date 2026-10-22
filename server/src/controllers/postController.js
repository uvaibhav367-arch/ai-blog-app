import { ApiError } from '../utils/ApiError.js';
import { validatePostPayload } from '../utils/validatePost.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function createPostController(repository) {
  return {
    list: asyncHandler(async (req, res) => {
      const { search = '', tag = '' } = req.query;
      const limit = Math.min(Number(req.query.limit) || 100, 100);
      const posts = await repository.list({ search: String(search), tag: String(tag), limit });

      res.json({
        success: true,
        count: posts.length,
        data: posts,
      });
    }),

    getOne: asyncHandler(async (req, res) => {
      const post = await repository.findById(req.params.id);
      if (!post) throw ApiError.notFound('Post not found');

      res.json({ success: true, data: post });
    }),

    create: asyncHandler(async (req, res) => {
      const data = validatePostPayload(req.body || {});
      const post = await repository.create(data);

      res.status(201).json({ success: true, data: post });
    }),

    update: asyncHandler(async (req, res) => {
      const data = validatePostPayload(req.body || {}, { partial: true });
      if (Object.keys(data).length === 0) {
        throw ApiError.badRequest('Nothing to update');
      }

      const post = await repository.update(req.params.id, data);
      if (!post) throw ApiError.notFound('Post not found');

      res.json({ success: true, data: post });
    }),

    remove: asyncHandler(async (req, res) => {
      const removed = await repository.remove(req.params.id);
      if (!removed) throw ApiError.notFound('Post not found');

      res.json({ success: true, message: 'Post deleted' });
    }),
  };
}
