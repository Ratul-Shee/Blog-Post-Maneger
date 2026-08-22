import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/api/posts`
  : '/api/posts';

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
      
      if (Array.isArray(response.data)) {
        setPosts(response.data);
        setError('');
      } else {
        setPosts([]);
        setError(
          response.data?.message || 'Received unexpected response from API server.'
        );
      }
    } catch (err) {
      setPosts([]);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Could not load posts.';
      
      setError(
        `${errMsg} (If this is MongoDB Atlas, make sure Network Access allows IP "0.0.0.0/0" for Vercel cloud deployments)`
      );
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
      if (response.data && typeof response.data === 'object' && response.data._id) {
        setPosts((prevPosts) => [response.data, ...(Array.isArray(prevPosts) ? prevPosts : [])]);
        setError('');
      } else {
        fetchPosts();
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      alert(`Failed to add post: ${errMsg}\n\nNote: If using MongoDB Atlas, check that Network Access includes "0.0.0.0/0" (Allow Access from Anywhere).`);
    }
  };

  // 3. Update an existing post
  const handleUpdatePost = async (id, postData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, postData);
      if (response.data && typeof response.data === 'object' && response.data._id) {
        setPosts((prevPosts) =>
          (Array.isArray(prevPosts) ? prevPosts : []).map((post) =>
            post._id === id ? response.data : post
          )
        );
        setEditingPost(null);
        setError('');
      } else {
        fetchPosts();
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      alert(`Failed to update post: ${errMsg}`);
    }
  };

  // 4. Delete a post
  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setPosts((prevPosts) =>
        (Array.isArray(prevPosts) ? prevPosts : []).filter((post) => post._id !== id)
      );
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      alert(`Failed to delete post: ${errMsg}`);
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
          <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
            <div>
              <strong>Database Notice: </strong>
              {error}
            </div>
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