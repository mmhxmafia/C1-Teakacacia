import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the GraphQL query to fetch product categories
const GET_CATEGORIES = gql`
  query GetCategories {
    productCategories(first: 6) {
      nodes {
        id
        name
        slug
        description
        count
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`;

const Categories = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);

  // Fallback static categories if WooCommerce categories aren't set up yet
  const staticCategories = [
    {
      id: 'static-1',
      name: 'Living Room',
      slug: 'living-room',
      description: 'Elegant furniture pieces to enhance your living space.',
      count: null,
    },
    {
      id: 'static-2',
      name: 'Dining Room',
      slug: 'dining-room',
      description: 'Handcrafted dining sets for memorable gatherings.',
      count: null,
    },
    {
      id: 'static-3',
      name: 'Bedroom',
      slug: 'bedroom',
      description: 'Comfortable and stylish bedroom furniture.',
      count: null,
    },
    {
      id: 'static-4',
      name: 'Office',
      slug: 'office',
      description: 'Professional furniture for your workspace.',
      count: null,
    },
    {
      id: 'static-5',
      name: 'Outdoor',
      slug: 'outdoor',
      description: 'Durable outdoor furniture for any weather.',
      count: null,
    },
    {
      id: 'static-6',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Beautiful accents to complete your home.',
      count: null,
    },
  ];

  // Use WooCommerce categories if available, otherwise use static fallback
  // Filter out "Uncategorized" category
  const categories = (data?.productCategories?.nodes && data.productCategories.nodes.length > 0) 
    ? data.productCategories.nodes.filter((cat: any) => cat.name.toLowerCase() !== 'uncategorized')
    : staticCategories;

  return (
    <section id="collections" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="h-1 w-12 sm:w-16 bg-primary rounded-full mx-auto" />
          </div>
          
          <h2 className="heading-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4 sm:mb-6 tracking-tight px-4">
            Explore Our Collections
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Browse our curated collection of furniture categories. Each piece is expertly crafted 
            to bring natural elegance and lasting quality to your home.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="rounded-sm bg-card border border-border animate-pulse"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-6">
                  <div className="h-6 bg-muted rounded mb-3 w-3/4" />
                  <div className="h-4 bg-muted rounded mb-2 w-full" />
                  <div className="h-4 bg-muted rounded mb-4 w-2/3" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Grid - Show even with error (fallback to static categories) */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-sm bg-card border border-border hover:shadow-hover transition-all duration-500 animate-fade-in hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center overflow-hidden relative">
                  {category.image?.sourceUrl ? (
                    <img 
                      src={category.image.sourceUrl} 
                      alt={category.image.altText || category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-4xl text-muted-foreground/20 heading-font transition-transform duration-500 group-hover:scale-110">
                      {category.name}
                    </span>
                  )}
                </div>
                
                <div className="p-4 sm:p-5 md:p-6 bg-card">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="heading-font text-lg sm:text-xl md:text-2xl font-medium text-foreground transition-transform duration-300 line-clamp-2">
                      {category.name}
                    </h3>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-1" />
                  </div>
                  
                  <p className="text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-xs sm:text-sm line-clamp-2">
                    {category.description || 'A collection of our finest furniture.'}
                  </p>
                  
                  <div className="text-xs sm:text-sm text-primary font-medium tracking-wide">
                    {category.count ? `${category.count} pieces` : 'View Collection'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Categories Button */}
        {!loading && (
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Link to="/categories">
              <Button size="lg" variant="outline" className="group">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
