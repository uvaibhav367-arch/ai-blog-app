import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { usePosts } from '../context/PostsContext.jsx';

export default function Home() {
  const { posts, tags, loading, error, search, setSearch, activeTag, setActiveTag } = usePosts();

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="hero-eyebrow">MERN stack · AI-assisted writing</p>
          <h1 className="hero-title">A blog engine that drafts the first paragraph for you.</h1>
          <p className="hero-text">
            React on the front end, Express in the middle, MongoDB underneath. Every post goes
            through the same RESTful API, and the editor can call the AI route to get a structured
            starting point.
          </p>
          <div className="hero-actions">
            <Link to="/write" className="btn btn-primary">
              Write a post
            </Link>
            <a className="btn btn-ghost" href="https://github.com/uvaibhav367-arch" target="_blank" rel="noreferrer">
              View the code
            </a>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search titles, content and tags"
            aria-label="Search posts"
          />

          <div className="tag-list">
            <button
              type="button"
              className={`tag tag-button ${activeTag === '' ? 'is-active' : ''}`}
              onClick={() => setActiveTag('')}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`tag tag-button ${activeTag === tag ? 'is-active' : ''}`}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {loading && <Loader />}
        {!loading && error && <p className="error-note">{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <EmptyState
            title="No posts found"
            message={search || activeTag ? 'Try a different search or clear the filters.' : undefined}
          />
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <p className="result-count">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
            <div className="post-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
