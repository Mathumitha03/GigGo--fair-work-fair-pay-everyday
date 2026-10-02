import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#1E293B', background: '#FFF8E1', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong while rendering Admin Portal</h2>
          <pre style={{ background: '#FFFDF6', padding: '16px', borderRadius: '8px', marginTop: '16px', overflowX: 'auto', color: '#EF4444', border: '1px solid #A3C4BC' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: '20px', padding: '12px 24px', borderRadius: '8px', background: '#4B7D73', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Cache &amp; Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
