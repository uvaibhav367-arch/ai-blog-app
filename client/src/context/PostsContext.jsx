import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const load = useCallback(async (nextSearch = search, nextTag = activeTag) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listPosts({ search: nextSearch, tag: nextTag });
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Could not load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeTag]);

  useEffect(() => {
    load(search, activeTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeTag]);

  const tags = useMemo(() => {
    const unique = new Set();
    posts.forEach((post) => (post.tags || []).forEach((tag) => unique.add(tag)));
    return [...unique].sort();
  }, [posts]);

  const value = useMemo(
    () => ({
      posts,
      tags,
      loading,
      error,
      search,
      activeTag,
      setSearch,
      setActiveTag,
      refresh: () => load(search, activeTag),
      removePost: async (id) => {
        await api.deletePost(id);
        setPosts((current) => current.filter((post) => post.id !== id));
      },
    }),
    [posts, tags, loading, error, search, activeTag, load],
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts must be used inside a PostsProvider');
  return context;
}
