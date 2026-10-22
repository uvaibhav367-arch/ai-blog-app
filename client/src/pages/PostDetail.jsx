import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { usePosts } from '../context/PostsContext.jsx';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refresh } = usePosts();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setPost(await api.getPost(id));
    } catch (err) {
      setError(err.message || 'Could not load that post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const remove = async () => {
    if (!window.confirm('Delete this post?')) return;
    await api.deletePost(id);
    await refresh();
    navigate('/');
  };

  if (loading) return <Loader label="Loading post..." />;
  if (error) {
    return (
      <div className="container section">
        <p className="error-note">{error}</p>
        <Link to="/" className="btn btn-ghost">
          Back to all posts
        </Link>
      </div>
    );
  }

  const paragraphs = String(post.content || '').split(/\n{2,}/);

  return (
    <article className="container article">
      <header className="article-header">
        <div className="tag-list">
          {(post.tags || []).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <h1>{post.title}</h1>
        <p className="article-meta">
          {post.author} · {formatDate(post.createdAt)} · {post.readTime || 1} min read
        </p>
      </header>

      <div className="article-body">
        {paragraphs.map((block, index) =>
          block.trim().startsWith('## ') ? (
            <h2 key={index}>{block.trim().slice(3)}</h2>
          ) : (
            <p key={index}>{block}</p>
          ),
        )}
      </div>

      <footer className="article-footer">
        <Link to="/" className="btn btn-ghost">
          Back to all posts
        </Link>
        <div className="editor-actions">
          <Link to={`/edit/${post.id}`} className="btn btn-primary">
            Edit
          </Link>
          <button type="button" className="btn btn-danger" onClick={remove}>
            Delete
          </button>
        </div>
      </footer>
    </article>
  );
}
