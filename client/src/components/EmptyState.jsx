import { Link } from 'react-router-dom';

export default function EmptyState({ title = 'No posts yet', message = 'Nothing matches your search right now.' }) {
  return (
    <div className="empty-state">
      <span className="empty-mark" aria-hidden="true">✎</span>
      <h3>{title}</h3>
      <p>{message}</p>
      <Link to="/write" className="btn btn-primary">
        Write the first post
      </Link>
    </div>
  );
}
