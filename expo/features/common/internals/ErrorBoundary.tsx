import React, { ErrorInfo } from 'react';

export type FallbackComponent = React.ComponentType<{ error: Error; errorInfo: any }>;

export type ErrorBoundaryProps = {
  fallback: FallbackComponent;
  catch?: (error: Error, errorInfo: any) => void;
  children: React.ReactNode;
};

export type ErrorParams = {
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorParams> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.catch) {
      this.props.catch(error, errorInfo);
    }
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error !== null) {
      const Component = this.props.fallback;
      return <Component error={this.state.error} errorInfo={this.state.errorInfo} />;
    }
    return this.props.children;
  }
}
