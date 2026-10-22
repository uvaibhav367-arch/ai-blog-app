import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { usePosts } from '../context/PostsContext.jsx';

const emptyForm = { title: '', excerpt: '', content: '', tags: '', coverColor: '#1a5276' };

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refresh } = usePosts();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const update = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const loadPost = async () => {
    try {
      const post = await api.getPost(id);
      setForm({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        tags: (post.tags || []).join(', '),
        coverColor: post.coverColor || '#1a5276',
      });
    } catch (err) {
      setError(err.message || 'Could not load that post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const generate = async () => {
    if (!prompt.trim()) {
      setError('Type a topic first so the assistant knows what to write about.');
      return;
    }

    setGenerating(true);
    setError(null);
    setNotice(null);

    try {
      const result = await api.generateDraft(prompt);
      setForm((current) => ({
        ...current,
        title: current.title || prompt.trim(),
        content: result.draft,
        excerpt:
          current.excerpt || result.draft.replace(/[#*]/g, '').split('\n').filter(Boolean)[0]?.slice(0, 180) || '',
      }));
      setNotice(
        result.source === 'openai'
          ? 'Draft generated with the OpenAI API. Edit it before publishing.'
          : 'Draft generated with the built-in local writer (no OPENAI_API_KEY configured).',
      );
    } catch (err) {
      setError(err.message || 'Could not generate a draft');
    } finally {
      setGenerating(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      coverColor: form.coverColor,
    };

    try {
      if (isEdit) {
        await api.updatePost(id, payload);
        await refresh();
        navigate(`/post/${id}`);
      } else {
        const created = await api.createPost(payload);
        await refresh();
        navigate(`/post/${created.id}`);
      }
    } catch (err) {
      const details = err.details?.length ? ` - ${err.details.map((d) => d.message).join(', ')}` : '';
      setError(`${err.message || 'Could not save the post'}${details}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="form-note">Loading post...</p>;
  }

  return (
    <form className="editor" onSubmit={submit}>
      <section className="panel">
        <h2 className="panel-title">Draft with AI</h2>
        <p className="panel-note">
          Give the assistant a topic and it will draft a structured article for you to edit and
          publish.
        </p>

        <div className="ai-row">
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="e.g. How caching improves API response times"
            aria-label="Topic for the AI draft"
          />
          <button type="button" className="btn btn-primary" onClick={generate} disabled={generating}>
            {generating ? 'Writing...' : 'Generate draft'}
          </button>
        </div>

        {notice && <p className="notice">{notice}</p>}
      </section>

      <section className="panel">
        <h2 className="panel-title">Post details</h2>

        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" type="text" value={form.title} onChange={update('title')} required maxLength={160} />
        </div>

        <div className="field">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            rows={2}
            value={form.excerpt}
            onChange={update('excerpt')}
            placeholder="One or two lines that show up on the post card."
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              value={form.tags}
              onChange={update('tags')}
              placeholder="React, Express, MongoDB"
            />
          </div>

          <div className="field">
            <label htmlFor="coverColor">Cover colour</label>
            <input
              id="coverColor"
              type="color"
              className="color-input"
              value={form.coverColor}
              onChange={update('coverColor')}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            rows={16}
            value={form.content}
            onChange={update('content')}
            required
            placeholder="Write your post..."
          />
        </div>

        {error && <p className="error-note">{error}</p>}

        <div className="editor-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Publish post'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </section>
    </form>
  );
}
