import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import craftsmanshipImg from "@/assets/about/craftsmanship.jpg";
import qualityImg from "@/assets/about/quality.jpg";
import designImg from "@/assets/about/design.jpg";
import heritageImg from "@/assets/about/heritage.jpg";

const AboutUs = () => {
  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>
            
            <h2 className="heading-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-3 sm:mb-4 tracking-tight">
              Edakkattu Furniture
            </h2>
            <p className="text-lg sm:text-xl font-semibold text-primary mb-4 sm:mb-6">
              Teakacacia LLP
            </p>
            
            <div className="space-y-4 sm:space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-base sm:text-lg font-semibold text-foreground">
                Furniture Wholesaler in Kerala & Bangalore, India
              </p>
              
              <p className="text-sm sm:text-base md:text-lg">
                Edakkattu Furniture is a premier manufacturer of all types of sofas and furniture. 
                We specialize in customizing furniture according to our customers' choice, ensuring 
                each piece perfectly matches your vision and requirements.
              </p>
              
              <p>
                Every piece we create is thoughtfully crafted from premium teak and acacia wood, 
                selected for their natural beauty, durability, and sustainable sourcing. Our designs honor 
                traditional craftsmanship while embracing contemporary aesthetics.
              </p>
              
              <p>
                Whether you need wholesale furniture solutions or custom-made pieces for your home, 
                we deliver exceptional quality and craftsmanship that lasts generations.
              </p>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-primary mb-1 sm:mb-2">2</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Manufacturing Hubs</div>
                <div className="text-xs text-muted-foreground mt-1 hidden sm:block">Kerala & Bangalore</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-primary mb-1 sm:mb-2">1000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Happy Customers</div>
                <div className="text-xs text-muted-foreground mt-1 hidden sm:block">Across India</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-primary mb-1 sm:mb-2">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Custom Made</div>
                <div className="text-xs text-muted-foreground mt-1 hidden sm:block">Your Choice</div>
              </div>
            </div>
            
            <div className="mt-10">
              <Link to="/about">
                <Button size="lg" className="group">
                  Know More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-sm overflow-hidden group">
                <img 
                  src={craftsmanshipImg} 
                  alt="Expert Craftsmanship" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden group">
                <img 
                  src={qualityImg} 
                  alt="Premium Quality" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden group">
                <img 
                  src={designImg} 
                  alt="Timeless Design" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="aspect-square bg-muted rounded-sm overflow-hidden group">
                <img 
                  src={heritageImg} 
                  alt="Rich Heritage" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
