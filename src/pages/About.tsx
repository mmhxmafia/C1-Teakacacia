import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Heart, Leaf, Users } from "lucide-react";
import craftsmanshipImg from "@/assets/about/craftsmanship.jpg";
import qualityImg from "@/assets/about/quality.jpg";
import designImg from "@/assets/about/design.jpg";
import heritageImg from "@/assets/about/heritage.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="About Us - Edakkattu Furniture | Teakacacia"
        description="Learn about Edakkattu Furniture's commitment to exceptional craftsmanship, sustainable materials, and timeless furniture design. Furniture wholesaler in Kerala and Bangalore, India."
        keywords="Edakkattu Furniture, furniture wholesaler Kerala, furniture manufacturer Bangalore, custom furniture India, sofa manufacturer, teakacacia"
      />
      <Navigation />
      
      <main className="pt-36">
        {/* Hero Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-primary rounded-full mx-auto" />
            </div>
            
            <h1 className="heading-font text-5xl sm:text-6xl font-medium text-foreground mb-6 tracking-tight">
              Edakkattu Furniture
            </h1>
            <p className="text-2xl font-semibold text-primary mb-4">
              Teakacacia LLP
            </p>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Leading furniture wholesaler and manufacturer based in Kerala and Bangalore, India. 
              We believe furniture is more than function—it's the foundation of your living spaces, 
              a reflection of your style, and an investment in quality that lasts generations.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div>
                <h2 className="heading-font text-4xl font-medium text-foreground mb-6">
                  About Edakkattu Furniture
                </h2>
                
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p className="text-lg font-semibold text-foreground">
                    Edakkattu Furniture - Your trusted furniture wholesaler and manufacturer
                  </p>
                  
                  <p className="text-lg">
                    Operating from Kerala and Bangalore, India, Edakkattu Furniture has established itself as 
                    a premier manufacturer of all types of sofas and furniture. Our brand Teakacacia LLP represents 
                    our commitment to excellence and quality craftsmanship.
                  </p>
                  
                  <p>
                    <strong>What We Offer:</strong><br/>
                    • Complete range of sofas and furniture manufacturing<br/>
                    • Custom furniture solutions tailored to your specific requirements<br/>
                    • Wholesale and retail services across India<br/>
                    • Premium quality materials and expert craftsmanship
                  </p>
                  
                  <p>
                    Every piece we create is thoughtfully crafted from premium teak and acacia wood, 
                    selected for their natural beauty, durability, and sustainable sourcing. We specialize in 
                    customizing furniture according to our customers' choice, ensuring each piece perfectly 
                    matches your vision and space.
                  </p>
                  
                  <p>
                    Our designs honor traditional craftsmanship while embracing contemporary aesthetics, 
                    creating furniture that transcends trends and becomes a lasting part of your home.
                  </p>
                </div>
              </div>

              {/* Right Image */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square bg-muted rounded-sm overflow-hidden">
                    <img 
                      src={craftsmanshipImg} 
                      alt="Expert Craftsmanship" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden">
                    <img 
                      src={qualityImg} 
                      alt="Premium Quality" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden">
                    <img 
                      src={designImg} 
                      alt="Timeless Design" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-muted rounded-sm overflow-hidden">
                    <img 
                      src={heritageImg} 
                      alt="Rich Heritage" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="h-1 w-16 bg-primary rounded-full mx-auto" />
              </div>
              
              <h2 className="heading-font text-4xl font-medium text-foreground mb-6">
                Our Values
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Quality */}
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="heading-font text-xl font-medium text-foreground mb-3">
                  Quality First
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We never compromise on quality. Every piece is crafted to the highest standards using premium materials.
                </p>
              </div>

              {/* Sustainability */}
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="heading-font text-xl font-medium text-foreground mb-3">
                  Sustainable
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  100% sustainably sourced wood. We're committed to protecting our planet for future generations.
                </p>
              </div>

              {/* Craftsmanship */}
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="heading-font text-xl font-medium text-foreground mb-3">
                  Craftsmanship
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Each piece is handcrafted by skilled artisans with decades of experience and passion.
                </p>
              </div>

              {/* Customer Focus */}
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="heading-font text-xl font-medium text-foreground mb-3">
                  Custom Solutions
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We customize furniture according to our customers' choice, ensuring each piece matches your exact requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">2</div>
                <div className="text-lg font-medium text-foreground mb-2">Manufacturing Hubs</div>
                <div className="text-sm text-muted-foreground">
                  Operating from Kerala and Bangalore, India
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">1000+</div>
                <div className="text-lg font-medium text-foreground mb-2">Happy Customers</div>
                <div className="text-sm text-muted-foreground">
                  Wholesale and retail clients across India
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">100%</div>
                <div className="text-lg font-medium text-foreground mb-2">Custom Solutions</div>
                <div className="text-sm text-muted-foreground">
                  Furniture tailored to your exact specifications
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-font text-4xl font-medium text-foreground mb-6">
              Ready to Transform Your Space?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our collection of handcrafted furniture and discover pieces that will bring 
              beauty and functionality to your home for generations to come.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="group">
                  Browse Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
