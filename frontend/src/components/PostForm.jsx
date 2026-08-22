import React, { useState, useEffect } from 'react';

// Helper to get local system date in YYYY-MM-DD format
const getSystemDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to format date string for HTML date input (YYYY-MM-DD)
const formatDateForInput = (dateValue) => {
  if (!dateValue) return getSystemDate();
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
    return dateValue.substring(0, 10);
  }
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return getSystemDate();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function PostForm({ onSubmit, onUpdate, editingPost, onCancel, loading }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedDate, setPublishedDate] = useState(getSystemDate());
  const [content, setContent] = useState('');

  // If editingPost changes, populate the form inputs
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || '');
      setAuthor(editingPost.author || '');
      setPublishedDate(formatDateForInput(editingPost.publishedDate));
      setContent(editingPost.content || '');
    } else {
      setTitle('');
      setAuthor('');
      setPublishedDate(getSystemDate());
      setContent('');
    }
  }, [editingPost]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !author || !content) {
      alert('Please fill in all fields.');
      return;
    }

    const postData = {
      title,
      author,
      publishedDate: publishedDate || getSystemDate(),
      content
    };

    if (editingPost) {
      onUpdate(editingPost._id, postData);
    } else {
      onSubmit(postData);
      setTitle('');
      setAuthor('');
      setPublishedDate(getSystemDate());
      setContent('');
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0 text-primary fw-bold">
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-bold">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Author */}
          <div className="mb-3">
            <label className="form-label fw-bold">Author</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          {/* Published Date */}
          <div className="mb-3">
            <label className="form-label fw-bold">Published Date</label>
            <input
              type="date"
              className="form-control"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div className="mb-3">
            <label className="form-label fw-bold">Content</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="Write content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {editingPost ? 'Update Post' : 'Publish Post'}
            </button>
            {editingPost && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;