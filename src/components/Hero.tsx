import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-furniture.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-slow">
        <h1 className="heading-font text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground mb-4 sm:mb-6 tracking-tight drop-shadow-lg">
          Custom Furniture
          <br />
          <span className="text-primary">Made Your Way</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-foreground mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-md px-2">
          Premier furniture wholesaler and manufacturer in<br className="hidden sm:inline" /> Kerala & Bangalore, India
        </p>
        <p className="text-sm sm:text-base md:text-lg text-foreground/90 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-sm px-2">
          We manufacture all types of sofas and furniture, customized according to your choice.<br className="hidden sm:inline" /> Wholesale and retail solutions across India.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 sm:px-0">
          <Link to="/products" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="shadow-soft group w-full sm:w-auto px-6 sm:px-8 min-h-[48px] text-base"
            >
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <Link to="/contact" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline"
              className="border-foreground/20 w-full sm:w-auto px-6 sm:px-8 min-h-[48px] text-base"
            >
              Custom Order Inquiry
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground/30 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
