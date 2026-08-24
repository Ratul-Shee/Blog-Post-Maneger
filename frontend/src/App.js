import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

const getApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (!envUrl) return '/api/posts';
  const clean = envUrl.replace(/\/$/, '');
  return clean.endsWith('/api/posts') ? clean : `${clean}/api/posts`;
};

const API_URL = getApiUrl();

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setPosts(Array.isArray(response.data) ? response.data : []);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching posts:', error);
      showNotification(
        error.response?.data?.message || 'Failed to connect to backend server. Make sure the backend is running.',
        true
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreatePost = async (postData) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(API_URL, postData);
      setPosts((prevPosts) => [response.data, ...prevPosts]);
      showNotification('Post published successfully!');
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      showNotification(error.response?.data?.message || 'Error publishing post', true);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePost = async (postData) => {
    if (!editingPost) return false;
    try {
      setIsSubmitting(true);
      const response = await axios.put(`${API_URL}/${editingPost._id}`, postData);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === editingPost._id ? response.data : p))
      );
      setEditingPost(null);
      showNotification('Post updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      showNotification(error.response?.data?.message || 'Error updating post', true);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== id));
      if (editingPost && editingPost._id === id) {
        setEditingPost(null);
      }
      showNotification('Post deleted successfully.');
    } catch (error) {
      console.error('Error deleting post:', error);
      showNotification(error.response?.data?.message || 'Error deleting post', true);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar postCount={posts.length} />

      <main className="container flex-grow-1 pb-5">
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            <span>{successMessage}</span>
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-4" role="alert">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            <strong>Notice: </strong>
            <span>{errorMessage}</span>
            <button
              type="button"
              className="btn-close"
              onClick={() => setErrorMessage('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="row g-4 g-xl-5 align-items-start">
          <div className="col-12 col-lg-5 sticky-sidebar">
            <PostForm
              onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
              editingPost={editingPost}
              onCancelEdit={() => setEditingPost(null)}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="col-12 col-lg-7">
            <PostList
              posts={posts}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onEdit={(post) => setEditingPost(post)}
              onDelete={handleDeletePost}
              onRefresh={fetchPosts}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;