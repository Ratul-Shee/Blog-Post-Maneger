import React from 'react';
import PostItem from './PostItem';

function PostList({ posts = [], loading = false, onEdit, onDelete }) {
  const safePosts = Array.isArray(posts) ? posts : [];

  if (loading && safePosts.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading posts...</p>
      </div>
    );
  }

  if (safePosts.length === 0) {
    return (
      <div className="card text-center p-4 shadow-sm">
        <p className="text-muted mb-0">No posts yet. Add one using the form!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold">Published Posts</h5>
        <span className="badge bg-secondary">{safePosts.length}</span>
      </div>

      <div className="row g-3">
        {safePosts.map((post, index) => {
          if (!post || typeof post !== 'object') return null;
          return (
            <div key={post._id || `post-${index}`} className="col-12 col-md-6">
              <PostItem
                post={post}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PostList;