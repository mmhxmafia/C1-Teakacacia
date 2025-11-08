import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Search, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Log 404 error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.pathname, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShop = () => {
    navigate('/products');
  };

  return (
    <>
      <SEO 
        title="Page Not Found - 404"
        description="The page you're looking for doesn't exist. Browse our furniture collection or return to homepage."
      />
      <Navigation />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          
          {/* 404 Number with Animation */}
          <div className="relative">
            <h1 className="text-[150px] sm:text-[200px] font-bold text-primary/10 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-24 w-24 sm:h-32 sm:w-32 text-primary animate-pulse" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <h2 className="heading-font text-3xl sm:text-4xl font-semibold text-foreground">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for seems to have been moved or doesn't exist.
            </p>
            <p className="text-sm text-muted-foreground">
              Attempted URL: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
            </p>
          </div>

          {/* Auto Redirect Notice */}
          <div className="bg-muted/50 border border-border rounded-lg p-4 animate-in fade-in duration-500 delay-200">
            <p className="text-sm text-muted-foreground">
              Redirecting to homepage in{' '}
              <span className="font-bold text-primary text-lg">{countdown}</span>{' '}
              seconds...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <Button
              onClick={handleGoHome}
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <Home className="h-5 w-5" />
              Go to Homepage
            </Button>
            
            <Button
              onClick={handleShop}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <Search className="h-5 w-5" />
              Browse Products
            </Button>
            
            <Button
              onClick={handleGoBack}
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t border-border animate-in fade-in duration-500 delay-400">
            <p className="text-sm text-muted-foreground mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <button
                onClick={() => navigate('/')}
                className="text-primary hover:underline"
              >
                Home
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => navigate('/products')}
                className="text-primary hover:underline"
              >
                All Products
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => navigate('/categories')}
                className="text-primary hover:underline"
              >
                Categories
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => navigate('/about')}
                className="text-primary hover:underline"
              >
                About Us
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => navigate('/contact')}
                className="text-primary hover:underline"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Brand Message */}
          <div className="pt-4 animate-in fade-in duration-500 delay-500">
            <p className="text-xs text-muted-foreground italic">
              "Custom Furniture Made Your Way"
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NotFound;
