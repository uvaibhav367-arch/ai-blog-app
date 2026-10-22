import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Editor from './pages/Editor.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/write" element={<Editor />} />
          <Route path="/edit/:id" element={<Editor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>Built with React, Express, MongoDB and a little bit of AI.</span>
          <a href="https://github.com/uvaibhav367-arch" target="_blank" rel="noreferrer">
            Source code
          </a>
        </div>
      </footer>
    </div>
  );
}
