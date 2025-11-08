import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// GraphQL query to fetch all categories
const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    productCategories(first: 50) {
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
  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES);
  const allCategories = useMemo(() => {
    // Filter out "Uncategorized" category
    return (data?.productCategories?.nodes || []).filter((cat: any) => 
      cat.name.toLowerCase() !== 'uncategorized'
    );
  }, [data]);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter categories based on search
  const categories = useMemo(() => {
    if (!searchQuery.trim()) return allCategories;
    
    return allCategories.filter((cat: any) => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCategories, searchQuery]);

  return (
    <div className="min-h-screen">
      <SEO 
        title="Browse Categories - Teakacacia"
        description="Explore our furniture categories. From living room to outdoor, find the perfect teak furniture for every space."
        keywords="furniture categories, teak furniture types, wooden furniture collection"
      />
      <Navigation />
      
      <main className="pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="h-1 w-16 bg-primary rounded-full mx-auto" />
            </div>
            
            <h1 className="heading-font text-4xl sm:text-5xl font-medium text-foreground mb-6 tracking-tight">
              Browse Categories
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover furniture organized by room and function. Each category features handcrafted pieces designed for beauty and durability.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {!loading && (
              <div className="mt-4 text-sm text-muted-foreground text-center">
                {categories.length} {categories.length === 1 ? 'category' : 'categories'} found
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-destructive">Error loading categories. Please try again.</p>
            </div>
          )}

          {/* Categories Grid */}
          {!loading && !error && categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category: any) => (
                <Link 
                  key={category.id} 
                  to={`/category/${category.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {category.image?.sourceUrl ? (
                        <img
                          src={category.image.sourceUrl}
                          alt={category.image.altText || category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-6xl opacity-30">🪑</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="heading-font text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {category.count} {category.count === 1 ? 'product' : 'products'}
                        </span>
                        <span className="text-primary group-hover:translate-x-1 transition-transform duration-300 inline-block">
                          View →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && categories.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="heading-font text-2xl font-medium text-foreground mb-3">
                {allCategories.length === 0 ? 'No Categories Yet' : 'No Categories Found'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {allCategories.length === 0 
                  ? 'Categories will appear here once created.'
                  : 'Try a different search term.'
                }
              </p>
              {allCategories.length > 0 && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
