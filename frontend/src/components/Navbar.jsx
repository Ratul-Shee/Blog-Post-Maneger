import React from 'react';

function Navbar({ postCount }) {
  return (
    <header className="site-navbar mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div className="brand-icon">
            <i className="bi bi-journal-text"></i>
          </div>
          <span className="brand-title">Blog Post Manager</span>
        </div>

        <div className="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-semibold small">
          <i className="bi bi-file-earmark-text text-primary me-1"></i>
          {postCount} {postCount === 1 ? 'Post' : 'Posts'}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
