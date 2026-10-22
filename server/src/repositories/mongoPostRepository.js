import Post from '../models/Post.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toPlain = (doc) => {
  if (!doc) return null;
  const obj = doc.toJSON ? doc.toJSON() : doc;
  return { ...obj, id: String(obj._id) };
};

export function createMongoPostRepository() {
  return {
    async list({ search = '', tag = '', limit = 100 } = {}) {
      const query = {};

      if (search) {
        const pattern = new RegExp(escapeRegex(search), 'i');
        query.$or = [{ title: pattern }, { content: pattern }, { excerpt: pattern }];
      }

      if (tag) {
        query.tags = { $regex: `^${escapeRegex(tag)}$`, $options: 'i' };
      }

      const docs = await Post.find(query).sort({ createdAt: -1 }).limit(limit);
      return docs.map(toPlain);
    },

    async findById(id) {
      if (!id.match(/^[a-f\d]{24}$/i)) return null;
      return toPlain(await Post.findById(id));
    },

    async create(data) {
      const doc = await Post.create(data);
      return toPlain(doc);
    },

    async update(id, data) {
      if (!id.match(/^[a-f\d]{24}$/i)) return null;
      const doc = await Post.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      return toPlain(doc);
    },

    async remove(id) {
      if (!id.match(/^[a-f\d]{24}$/i)) return false;
      const result = await Post.findByIdAndDelete(id);
      return Boolean(result);
    },

    async count() {
      return Post.countDocuments();
    },
  };
}
