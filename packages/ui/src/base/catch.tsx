import { Component } from "react";

type CatchProps = {
    children?: React.ReactNode;
    fallback?:
        | React.ReactNode
        | ((error: unknown, recover: () => void) => React.ReactNode);
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

type State = { didCatch: boolean; error: unknown };

export class Catch extends Component<CatchProps, State> {
    state: State = { didCatch: false, error: null };
    static getDerivedStateFromError(error: unknown): Partial<State> | null {
        return { didCatch: true, error };
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.props.onError?.(error, errorInfo);
    }
    private _recover = () => {
        this.setState({ didCatch: false, error: null });
    };
    render() {
        const { children, fallback } = this.props;
        const { didCatch, error } = this.state;

        if (didCatch) {
            return typeof fallback === "function" ?
                    fallback(error, this._recover)
                :   fallback;
        }

        return children;
    }
}
