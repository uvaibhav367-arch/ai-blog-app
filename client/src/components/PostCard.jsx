import { Link } from 'react-router-dom';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/post/${post.id}`} className="post-cover" style={{ background: post.coverColor || '#1a5276' }}>
        <span className="post-cover-initial">{String(post.title || 'A').charAt(0)}</span>
      </Link>

      <div className="post-card-body">
        <div className="tag-list">
          {(post.tags || []).slice(0, 3).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <h2 className="post-card-title">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h2>

        <p className="post-card-excerpt">{post.excerpt}</p>

        <div className="post-meta">
          <span>{formatDate(post.createdAt)}</span>
          <span className="meta-dot" aria-hidden="true">•</span>
          <span>{post.readTime || 1} min read</span>
        </div>
      </div>
    </article>
  );
}
