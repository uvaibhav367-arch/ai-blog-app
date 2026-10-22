import { ApiError } from '../utils/ApiError.js';

const clean = (value) => (typeof value === 'string' ? value.trim() : value);

export function validatePostPayload(payload, { partial = false } = {}) {
  const errors = [];
  const data = {};

  const title = clean(payload.title);
  const content = clean(payload.content);
  const excerpt = clean(payload.excerpt);
  const author = clean(payload.author);
  const coverColor = clean(payload.coverColor);

  if (!partial || title !== undefined) {
    if (!title) {
      errors.push({ field: 'title', message: 'Title is required' });
    } else if (title.length > 160) {
      errors.push({ field: 'title', message: 'Title cannot exceed 160 characters' });
    } else {
      data.title = title;
    }
  }

  if (!partial || content !== undefined) {
    if (!content) {
      errors.push({ field: 'content', message: 'Content is required' });
    } else if (content.length < 20) {
      errors.push({ field: 'content', message: 'Content must be at least 20 characters' });
    } else {
      data.content = content;
    }
  }

  if (excerpt !== undefined) {
    data.excerpt = excerpt.slice(0, 320);
  }

  if (author !== undefined) {
    data.author = author;
  }

  if (coverColor !== undefined) {
    data.coverColor = /^#[0-9a-f]{6}$/i.test(coverColor) ? coverColor : '#1a5276';
  }

  if (payload.tags !== undefined) {
    const tags = Array.isArray(payload.tags)
      ? payload.tags
      : String(payload.tags)
          .split(',')
          .map((tag) => tag.trim());

    data.tags = [...new Set(tags.filter(Boolean))].slice(0, 8);
  }

  if (payload.published !== undefined) {
    data.published = Boolean(payload.published);
  }

  if (errors.length) {
    throw ApiError.badRequest('Validation failed', errors);
  }

  return data;
}
