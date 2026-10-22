import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [320, 'Excerpt cannot exceed 320 characters'],
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      trim: true,
      default: 'Vaibhav Upadhyay',
    },
    coverColor: {
      type: String,
      default: '#1a5276',
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
);

postSchema.virtual('readTime').get(function getReadTime() {
  const words = String(this.content || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
});

postSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.models.Post || mongoose.model('Post', postSchema);
