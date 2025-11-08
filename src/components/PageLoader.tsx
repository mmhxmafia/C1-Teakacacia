import LoadingSpinner from "./LoadingSpinner";

interface PageLoaderProps {
  text?: string;
}

/**
 * Full-page loading component
 * Used when entire page is loading
 */
const PageLoader = ({ text = "Loading page..." }: PageLoaderProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

export default PageLoader;
