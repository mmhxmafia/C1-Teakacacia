import { useEffect, useState } from 'react';
import edakkattuLogo from '@/assets/edakkattu-logo.png';
import teakacaciaLogo from '@/assets/teakacacia-logo.png';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Remove splash screen after fade out completes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-background via-background to-muted flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-8 px-4">
        {/* Logos with Animation */}
        <div className="flex items-center justify-center gap-4 animate-in fade-in zoom-in duration-700">
          <img
            src={edakkattuLogo}
            alt="Edakkattu Furniture"
            className="h-16 sm:h-20 w-auto"
          />
          <div className="h-20 sm:h-24 w-px bg-border" />
          <img
            src={teakacaciaLogo}
            alt="Teakacacia LLP"
            className="h-20 sm:h-24 w-auto"
          />
        </div>

        {/* Brand Name */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h1 className="heading-font text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            Edakkattu Furniture
          </h1>
          <p className="text-sm sm:text-base text-primary font-medium tracking-wide">
            Custom Furniture Made Your Way
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700 delay-300">
          {/* Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          {/* Loading Text */}
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your experience...
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto animate-in fade-in duration-700 delay-500">
          Premier furniture wholesaler and manufacturer in Kerala & Bangalore, India
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
