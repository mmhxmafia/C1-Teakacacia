import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  technical?: string | Error;
  className?: string;
}

const ErrorDisplay = ({ 
  title = "Something went wrong",
  message = "We're having trouble loading this content. Please try again.",
  onRetry,
  technical,
  className = ""
}: ErrorDisplayProps) => {
  // Log technical details for developers
  if (technical && process.env.NODE_ENV === 'development') {
    console.error('[Error Display]', technical);
  }

  return (
    <div className={`rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-6 ${className}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-200">
              {title}
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {message}
            </p>
          </div>

          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}

          {/* Developer Info in Development Mode */}
          {process.env.NODE_ENV === 'development' && technical && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-red-600 dark:text-red-400 hover:underline">
                Technical Details (Dev Only)
              </summary>
              <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs overflow-auto max-h-40">
                {typeof technical === 'string' ? technical : JSON.stringify(technical, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
