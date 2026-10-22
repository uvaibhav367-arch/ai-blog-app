import { Router } from 'express';
import { generateDraft } from '../services/aiService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function createAiRouter() {
  const router = Router();

  router.post(
    '/generate',
    asyncHandler(async (req, res) => {
      const { prompt } = req.body || {};
      const result = await generateDraft(prompt);

      res.json({
        success: true,
        data: {
          draft: result.draft,
          source: result.source,
          model: result.model,
        },
      });
    }),
  );

  return router;
}
