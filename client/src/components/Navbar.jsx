import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">AI</span>
          <span>Blog</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/write">Write a post</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
