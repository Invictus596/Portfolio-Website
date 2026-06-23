import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-center size-full bg-ctp-900 text-white p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">Something went wrong</h1>
            <pre className="text-red-400 text-sm max-w-xl mx-auto overflow-auto">
              {this.state.error?.message}
            </pre>
            <pre className="text-ctp-400 text-xs mt-2 max-w-xl mx-auto overflow-auto">
              {this.state.error?.stack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
