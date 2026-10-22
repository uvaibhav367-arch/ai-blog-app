import { randomUUID } from 'node:crypto';

const readTimeFor = (content) => {
  const words = String(content || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const excerptFor = (content) => {
  const clean = String(content || '').replace(/\s+/g, ' ').trim();
  return clean.length > 180 ? `${clean.slice(0, 177)}...` : clean;
};

const SEED_POSTS = [
  {
    title: 'Building a MERN Blog with AI-Assisted Drafts',
    content:
      'A full-stack blog platform built with React, Node.js, Express and MongoDB. The Express layer exposes a RESTful API with the five CRUD endpoints, Mongoose keeps the schema flexible while still validating required fields, and the React front end renders the list, the detail view and the editor.\n\nThe interesting part is the draft generator. Instead of leaving an empty textarea, the editor can ask the server for a structured first draft and then edit it. That keeps the writer in control while removing the blank-page problem.',
    tags: ['MERN', 'React', 'Express'],
    coverColor: '#1a5276',
  },
  {
    title: 'RESTful APIs with Express and Mongoose',
    content:
      'Every route in this project does one thing and returns a predictable shape. Validation happens in a controller, persistence is behind a repository, and errors flow into a single middleware that converts them into JSON.\n\nKeeping the repository behind an interface means the API layer never talks to Mongoose directly. Swapping the datastore means implementing one file instead of hunting through controllers.',
    tags: ['Express', 'MongoDB', 'API'],
    coverColor: '#0f766e',
  },
  {
    title: 'Responsive React with Hooks and React Router',
    content:
      'The interface is a single-page application. React Router handles the transitions between the list, the detail route and the editor, and every data fetch lives in a small custom hook so that loading and error states are handled in one place.\n\nStyling is plain CSS with custom properties, which keeps the bundle tiny and makes the light and dark themes a two-line change.',
    tags: ['React', 'Hooks', 'CSS'],
    coverColor: '#7c3aed',
  },
];

export function createMemoryPostRepository({ seed = true } = {}) {
  const posts = new Map();

  const build = (data, createdAt) => {
    const now = createdAt || new Date().toISOString();
    const content = data.content || '';
    return {
      _id: randomUUID(),
      id: undefined,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || excerptFor(content),
      content,
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author || 'Vaibhav Upadhyay',
      coverColor: data.coverColor || '#1a5276',
      published: data.published ?? true,
      readTime: readTimeFor(content),
      createdAt: now,
      updatedAt: now,
    };
  };

  const hydrate = (post) => (post ? { ...post, id: post._id } : null);

  if (seed) {
    const now = Date.now();
    SEED_POSTS.forEach((data, index) => {
      const post = build(data, new Date(now - index * 3600_000).toISOString());
      posts.set(post._id, post);
    });
  }

  return {
    async list({ search = '', tag = '', limit = 100 } = {}) {
      const needle = search.trim().toLowerCase();
      const wanted = tag.trim().toLowerCase();

      return Array.from(posts.values())
        .filter((post) => {
          if (wanted && !post.tags.some((t) => t.toLowerCase() === wanted)) return false;
          if (!needle) return true;
          return `${post.title} ${post.content} ${post.excerpt}`
            .toLowerCase()
            .includes(needle);
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
        .map(hydrate);
    },

    async findById(id) {
      return hydrate(posts.get(id));
    },

    async create(data) {
      const post = build(data);
      posts.set(post._id, post);
      return hydrate(post);
    },

    async update(id, data) {
      const existing = posts.get(id);
      if (!existing) return null;
      const updated = {
        ...existing,
        ...data,
        _id: existing._id,
        updatedAt: new Date().toISOString(),
      };
      if (data.excerpt !== undefined) {
        updated.excerpt = data.excerpt;
      } else if (data.content !== undefined) {
        updated.excerpt = excerptFor(updated.content);
      }
      if (data.content !== undefined) {
        updated.readTime = readTimeFor(updated.content);
      }
      posts.set(id, updated);
      return hydrate(updated);
    },

    async remove(id) {
      return posts.delete(id);
    },

    async count() {
      return posts.size;
    },
  };
}
