import React from 'react';
import PostItem from './PostItem';

function PostList({
  posts,
  loading,
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
  onRefresh,
}) {
  const filteredPosts = posts.filter((post) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    const title = (post.title || '').toLowerCase();
    const author = (post.author || '').toLowerCase();
    const content = (post.content || '').toLowerCase();
    return title.includes(query) || author.includes(query) || content.includes(query);
  });

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <h5 className="mb-0 fw-bold text-dark">Published Posts</h5>
          <span className="badge bg-secondary rounded-pill px-2.5 py-1 small">
            {filteredPosts.length}
          </span>
        </div>

        <div className="search-container" style={{ minWidth: '220px' }}>
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control-simple search-input"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && posts.length === 0 && (
        <div className="simple-card text-center p-5">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <p className="text-muted mb-0">Loading posts...</p>
        </div>
      )}

      {!loading && filteredPosts.length === 0 && (
        <div className="simple-card text-center p-5">
          <i className="bi bi-journal-text text-muted fs-1 mb-2 d-block"></i>
          <h6 className="fw-bold text-dark mb-1">
            {posts.length === 0 ? 'No posts yet' : 'No matching posts found'}
          </h6>
          <p className="text-muted small mb-3">
            {posts.length === 0
              ? 'Create your first post using the form on the left.'
              : `No posts matched your search "${searchTerm}".`}
          </p>

          {searchTerm ? (
            <button
              type="button"
              className="btn-secondary-simple btn-sm"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          ) : (
            <button
              type="button"
              className="btn-secondary-simple btn-sm"
              onClick={onRefresh}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          )}
        </div>
      )}

      <div className="row g-3">
        {filteredPosts.map((post) => (
          <div key={post._id} className="col-12 col-md-6">
            <PostItem post={post} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
