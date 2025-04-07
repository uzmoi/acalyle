import { Component } from "react";

export interface CatchProps {
  children?: React.ReactNode;
  fallback?:
    | React.ReactNode
    | ((error: unknown, recover: () => void) => React.ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  didCatch: boolean;
  error: unknown;
}

export class Catch extends Component<CatchProps, State> {
  state: State = { didCatch: false, error: null };
  static getDerivedStateFromError(error: unknown): Partial<State> | null {
    return { didCatch: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }
  private _recover = (): void => {
    this.setState({ didCatch: false, error: null });
  };
  render(): React.ReactNode {
    const { children, fallback } = this.props;
    const { didCatch, error } = this.state;

    if (didCatch) {
      return typeof fallback === "function" ?
          fallback(error, this._recover)
        : fallback;
    }

    return children;
  }
}
