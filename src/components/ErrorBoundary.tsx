import React, { Component, ErrorInfo, PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RotateCcw, Home, RefreshCw } from "lucide-react";

interface Props extends PropsWithChildren {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-[500px] border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-32 h-32"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Main Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    className="stroke-purple-100"
                    strokeWidth="8"
                  />
                  {/* Animated Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    className="stroke-red-500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="565.48"
                    strokeDashoffset="0"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="565.48"
                      to="0"
                      dur="2s"
                      fill="freeze"
                    />
                  </circle>
                  {/* Expression */}
                  <path
                    d="M65,95 Q100,120 135,95"
                    className="stroke-red-500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  >
                    <animate
                      attributeName="d"
                      values="M65,95 Q100,120 135,95;M65,105 Q100,80 135,105;M65,95 Q100,120 135,95"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Eyes */}
                  <circle cx="80" cy="75" r="8" className="fill-red-500">
                    <animate
                      attributeName="cy"
                      values="75;73;75"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="120" cy="75" r="8" className="fill-red-500">
                    <animate
                      attributeName="cy"
                      values="75;73;75"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-xl font-medium text-gray-900">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-500 text-sm">
                  Don't worry, this happens sometimes. Let's try refreshing the
                  page or returning to the homepage.
                </p>

                {process.env.NODE_ENV === "development" && (
                  <div className="mt-4 text-left">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Error Details (Development Only):
                    </div>
                    <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto text-gray-600 border">
                      {this.state.error?.message}
                      {this.state.error?.stack && (
                        <div className="mt-2 text-gray-500">
                          {this.state.error.stack
                            .split("\n")
                            .slice(1)
                            .join("\n")}
                        </div>
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-center gap-3 pb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/")}
                className="text-gray-600"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export const useAsyncError = () => {
  const [, setError] = React.useState();

  return React.useCallback(
    (e: Error) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
};

export default ErrorBoundary;
