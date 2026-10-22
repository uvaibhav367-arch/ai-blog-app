import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container section empty-state">
      <span className="empty-mark" aria-hidden="true">404</span>
      <h3>Page not found</h3>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">
        Back to the blog
      </Link>
    </section>
  );
}
