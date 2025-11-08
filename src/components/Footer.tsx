import { Facebook, Instagram, MapPin } from "lucide-react";
import logo from "@/assets/teakacacia-logo.png";
import edakkattuLogo from "@/assets/edakkattu-logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Custom Furniture", href: "/contact" },
      { label: "Wholesale Inquiry", href: "/contact" },
    ],
    about: [
      { label: "About Edakkattu Furniture", href: "/about" },
      { label: "Our Locations", href: "/about" },
      { label: "Custom Solutions", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
    support: [
      { label: "Shipping & Delivery", href: "/contact" },
      { label: "Custom Orders", href: "/contact" },
      { label: "Wholesale Program", href: "/contact" },
      { label: "Care Guide", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logos - Same style as navbar */}
            <div className="mb-4 flex items-center gap-3">
              <img 
                src={edakkattuLogo} 
                alt="Edakkattu Furniture" 
                className="h-8 sm:h-10 w-auto"
              />
              <div className="h-16 sm:h-20 w-px bg-border" />
              <img 
                src={logo} 
                alt="Teakacacia LLP" 
                className="h-16 sm:h-20 w-auto"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Edakkattu Furniture</h3>
            <p className="text-xs sm:text-sm font-medium text-primary mb-3 sm:mb-4">Teakacacia LLP</p>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
              Premier furniture wholesaler and manufacturer. We specialize in all types of sofas and custom furniture solutions.
            </p>
            
            {/* Locations */}
            <div className="mb-4 sm:mb-6 space-y-2">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Kerala, India</p>
                  <p className="text-sm">Manufacturing & Wholesale Hub</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Bangalore, India</p>
                  <p className="text-sm">Manufacturing & Wholesale Hub</p>
                </div>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div>
              <h4 className="text-sm sm:text-base font-medium mb-3">Stay Connected</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 sm:px-4 py-2 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="px-4 sm:px-6 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-sm sm:text-base font-medium mb-3 sm:mb-4 heading-font">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground transition-smooth relative inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-medium mb-3 sm:mb-4 heading-font">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground transition-smooth relative inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-medium mb-3 sm:mb-4 heading-font">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground transition-smooth relative inline-block after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Edakkattu Furniture | Teakacacia LLP. All Rights Reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/edwood.furnitures.5/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#1877F2] transition-all duration-300 hover:scale-110"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/edakkattufurniture/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#E4405F] transition-all duration-300 hover:scale-110"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
