import PostForm from '../components/PostForm.jsx';

export default function Editor() {
  return (
    <section className="container section">
      <h1 className="page-title">Write a post</h1>
      <p className="page-subtitle">
        Start from a blank page, or let the assistant draft the structure for you.
      </p>
      <PostForm />
    </section>
  );
}
