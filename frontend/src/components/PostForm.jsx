import React, { useState, useEffect } from 'react';

const getSystemDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function PostForm({ onSubmit, editingPost, onCancelEdit, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedDate, setPublishedDate] = useState(getSystemDate());
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || '');
      setAuthor(editingPost.author || '');
      setPublishedDate(
        editingPost.publishedDate
          ? editingPost.publishedDate.split('T')[0]
          : getSystemDate()
      );
      setContent(editingPost.content || '');
    } else {
      resetForm();
    }
  }, [editingPost]);

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setPublishedDate(getSystemDate());
    setContent('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !content.trim()) {
      alert('Please fill in all required fields: Title, Author, and Content.');
      return;
    }

    const postData = {
      title: title.trim(),
      author: author.trim(),
      publishedDate: publishedDate || getSystemDate(),
      content: content.trim(),
    };

    const success = await onSubmit(postData);

    if (success && !editingPost) {
      resetForm();
    }
  };

  return (
    <div className="simple-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold text-dark">
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h5>
        {editingPost && (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
            Editing Mode
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label-simple">Title *</label>
          <input
            type="text"
            className="form-control-simple"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label-simple">Author *</label>
          <input
            type="text"
            className="form-control-simple"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label-simple">Published Date</label>
          <input
            type="date"
            className="form-control-simple"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label-simple">Content *</label>
          <textarea
            className="form-control-simple"
            rows="5"
            placeholder="Write post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="d-flex gap-2 pt-1">
          <button
            type="submit"
            className="btn-primary-simple flex-grow-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                Saving...
              </>
            ) : editingPost ? (
              'Update Post'
            ) : (
              'Publish Post'
            )}
          </button>

          {editingPost && (
            <button
              type="button"
              className="btn-secondary-simple"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PostForm;
