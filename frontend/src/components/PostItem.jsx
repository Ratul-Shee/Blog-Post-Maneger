import React from 'react';

function PostItem({ post, onEdit, onDelete }) {
  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
      const parts = dateValue.substring(0, 10).split('-');
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    const date = new Date(dateValue);
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  };

  const formattedDate = formatDate(post.publishedDate);

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-primary fw-bold">{post.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted small">
          By <strong>{post.author}</strong> • {formattedDate}
        </h6>
        <p className="card-text">{post.content}</p>
      </div>
      <div className="card-footer bg-white border-top-0 d-flex justify-content-end gap-2 pb-3">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => onEdit(post)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(post._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default PostItem;