import React, { useState } from 'react';

function PostItem({ post, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!post) return null;

  const contentText = post.content || '';
  const isLongContent = contentText.length > 130;

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const cleanDate = typeof dateStr === 'string' ? dateStr.split('T')[0] : dateStr;
      if (typeof cleanDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
        const [y, m, d] = cleanDate.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return String(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return String(dateStr);
    }
  };

  const handleDeleteClick = () => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${post.title}"?`);
    if (isConfirmed) {
      onDelete(post._id);
    }
  };

  return (
    <article className="simple-card post-card p-3 d-flex flex-column h-100 w-100">
      <div className="flex-grow-1 p-2" style={{ minWidth: 0 }}>
        <h5 className="card-title-custom mb-2">
          {post.title || 'Untitled Post'}
        </h5>

        <div className="post-meta d-flex align-items-center gap-2 mb-3">
          <span className="d-inline-flex align-items-center gap-1">
            <i className="bi bi-person text-secondary"></i>
            <strong className="text-dark">{post.author || 'Anonymous'}</strong>
          </span>

          {post.publishedDate && (
            <>
              <span className="text-muted">•</span>
              <span className="d-inline-flex align-items-center gap-1 text-muted">
                <i className="bi bi-calendar3"></i> {formatDisplayDate(post.publishedDate)}
              </span>
            </>
          )}
        </div>

        <p className={`post-content ${isExpanded ? 'expanded' : 'clamp-3'}`}>
          {contentText}
        </p>

        {isLongContent && (
          <button
            type="button"
            className="btn-read-more"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <i className="bi bi-chevron-up"></i>
              </>
            ) : (
              <>
                <span>Read more</span>
                <i className="bi bi-chevron-down"></i>
              </>
            )}
          </button>
        )}
      </div>

      <div className="pt-2 px-2 pb-1 border-top d-flex justify-content-end gap-2 mt-auto">
        <button
          type="button"
          className="btn-icon-simple"
          onClick={() => {
            onEdit(post);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Edit Post"
          aria-label="Edit post"
        >
          <i className="bi bi-pencil"></i>
        </button>

        <button
          type="button"
          className="btn-icon-simple btn-delete"
          onClick={handleDeleteClick}
          title="Delete Post"
          aria-label="Delete post"
        >
          <i className="bi bi-trash3"></i>
        </button>
      </div>
    </article>
  );
}

export default PostItem;