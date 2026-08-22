import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

const API_BASE_URL = '/api/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);

  // 1. Fetch posts from the backend server
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Could not load posts. Please make sure the backend server is running.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. Add a new post
  const handleCreatePost = async (postData) => {
    try {
      const response = await axios.post(API_BASE_URL, postData);
      setPosts((prevPosts) => [response.data, ...prevPosts]);
    } catch (err) {
      alert('Failed to add post. ' + (err.response?.data?.message || err.message));
    }
  };

  // 3. Update an existing post
  const handleUpdatePost = async (id, postData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, postData);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === id ? response.data : post))
      );
      setEditingPost(null);
    } catch (err) {
      alert('Failed to update post. ' + (err.response?.data?.message || err.message));
    }
  };

  // 4. Delete a post
  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (err) {
      alert('Failed to delete post. ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Standard Bootstrap Navbar */}
      <nav className="navbar navbar-dark bg-dark mb-4 shadow-sm">
        <div className="container">
          <span className="navbar-brand h1 mb-0 fw-bold">Blog Post Manager</span>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container">
        {/* Error message */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError('')}
            ></button>
          </div>
        )}

        {/* Side-by-side layout using Bootstrap Grid */}
        <div className="row g-4">
          {/* Left Column: Form */}
          <div className="col-12 col-md-5">
            <PostForm
              onSubmit={handleCreatePost}
              onUpdate={handleUpdatePost}
              editingPost={editingPost}
              onCancel={() => setEditingPost(null)}
              loading={loading}
            />
          </div>

          {/* Right Column: Post List */}
          <div className="col-12 col-md-7">
            <PostList
              posts={posts}
              loading={loading}
              onEdit={(post) => setEditingPost(post)}
              onDelete={handleDeletePost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;