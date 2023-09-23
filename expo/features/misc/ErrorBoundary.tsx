import React from "react";

export default class ErrorBoundary extends React.Component<
  {
    fallback: React.ReactElement;
    children: React.ReactElement;
  },
  {
    hasError: boolean;
  }
> {
  constructor(props: {
    fallback: React.ReactElement;
    children: React.ReactElement;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {}

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
