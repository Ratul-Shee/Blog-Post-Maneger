import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="card shadow border-danger mx-auto" style={{ maxWidth: '600px' }}>
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Something went wrong</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                An unexpected error occurred while rendering the application.
              </p>
              {this.state.error && (
                <div className="alert alert-secondary font-monospace small mb-3">
                  {this.state.error.message || String(this.state.error)}
                </div>
              )}
              <button className="btn btn-primary" onClick={this.handleReload}>
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
