import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState, useMemo } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SEO from "@/components/SEO";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const GET_CATEGORY_PRODUCTS = gql`
  query GetCategoryProducts($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      count
      image {
        sourceUrl
        altText
      }
      products {
        nodes {
          id
          slug
          name
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
          ... on VariableProduct {
            price
            regularPrice
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // First, get the category to get its ID
  const { loading, error, data } = useQuery(GET_CATEGORY_PRODUCTS, {
    variables: { slug },
    skip: !slug,
  });

  const category = data?.productCategory;
  const allProducts = category?.products?.nodes || [];
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  
  // Filter and sort products
  const products = useMemo(() => {
    let filtered = [...allProducts];
    
    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price || product.regularPrice || '0');
        switch(priceRange) {
          case 'under-20000': return price < 20000;
          case '20000-40000': return price >= 20000 && price < 40000;
          case '40000-60000': return price >= 40000 && price < 60000;
          case 'over-60000': return price >= 60000;
          default: return true;
        }
      });
    }
    
    // Sort
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price || a.regularPrice || '0');
          const priceB = parseFloat(b.price || b.regularPrice || '0');
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price || a.regularPrice || '0');
          const priceB = parseFloat(b.price || b.regularPrice || '0');
          return priceB - priceA;
        });
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    return filtered;
  }, [allProducts, searchQuery, priceRange, sortBy]);
  
  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange('all');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen">
      {category && (
        <SEO 
          title={`${category.name} - Furniture Collection`}
          description={category.description || `Browse our ${category.name} collection. Handcrafted teak and acacia wood furniture.`}
          keywords={`${category.name}, teak furniture, wooden furniture, ${slug}`}
        />
      )}
      <Navigation />
      
      <main className="pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <h1 className="heading-font text-3xl font-medium text-foreground mb-4">
                Category Not Found
              </h1>
              <p className="text-muted-foreground mb-4">
                The category you're looking for doesn't exist or hasn't been created yet.
              </p>
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 max-w-2xl mx-auto text-left">
                <p className="text-sm text-red-800 font-semibold mb-2">Error Details:</p>
                <p className="text-xs text-red-700 font-mono">{error.message}</p>
              </div>
              <a
                href="/"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </a>
            </div>
          )}

          {/* Category Content */}
          {!loading && !error && category && (
            <div>
              {/* Category Header */}
              <div className="text-center mb-12">
                <div className="inline-block mb-4">
                  <div className="h-1 w-16 bg-primary rounded-full mx-auto" />
                </div>
                
                <h1 className="heading-font text-4xl sm:text-5xl font-medium text-foreground mb-6 tracking-tight">
                  {category.name}
                </h1>
                
                {category.description && (
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>
              
              {/* Search and Filters Bar */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search in this category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Desktop Filters */}
                  <div className="hidden lg:flex gap-4">
                    {/* Price Range */}
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="under-20000">Under ₹20,000</SelectItem>
                        <SelectItem value="20000-40000">₹20,000 - ₹40,000</SelectItem>
                        <SelectItem value="40000-60000">₹40,000 - ₹60,000</SelectItem>
                        <SelectItem value="over-60000">Over ₹60,000</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name-az">Name: A to Z</SelectItem>
                        <SelectItem value="name-za">Name: Z to A</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {(searchQuery || priceRange !== 'all' || sortBy !== 'default') && (
                      <Button variant="outline" onClick={resetFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                  
                  {/* Mobile Filters Button */}
                  <Sheet>
                    <SheetTrigger asChild className="lg:hidden">
                      <Button variant="outline" className="w-full">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters & Sort
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Filters & Sort</SheetTitle>
                        <SheetDescription>
                          Refine your product search
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        {/* Price Range */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Price Range</label>
                          <Select value={priceRange} onValueChange={setPriceRange}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Prices" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Prices</SelectItem>
                              <SelectItem value="under-20000">Under ₹20,000</SelectItem>
                              <SelectItem value="20000-40000">₹20,000 - ₹40,000</SelectItem>
                              <SelectItem value="40000-60000">₹40,000 - ₹60,000</SelectItem>
                              <SelectItem value="over-60000">Over ₹60,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Sort */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Sort By</label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                              <SelectValue placeholder="Default" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="price-low">Price: Low to High</SelectItem>
                              <SelectItem value="price-high">Price: High to Low</SelectItem>
                              <SelectItem value="name-az">Name: A to Z</SelectItem>
                              <SelectItem value="name-za">Name: Z to A</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {(searchQuery || priceRange !== 'all' || sortBy !== 'default') && (
                          <Button variant="outline" onClick={resetFilters} className="w-full">
                            Clear All Filters
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                {/* Results count */}
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {products.length} of {allProducts.length} products
                </div>
              </div>

              {/* Products Grid */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product: any, index: number) => (
                    <ProductCard key={product?.id || product?.slug || index} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 px-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <span className="text-4xl">{allProducts.length === 0 ? '📦' : '🔍'}</span>
                  </div>
                  <h3 className="heading-font text-2xl font-medium text-foreground mb-3">
                    {allProducts.length === 0 ? 'No Products Yet' : 'No Products Found'}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
                    {allProducts.length === 0 
                      ? "We're currently curating products for this collection. Check back soon to discover beautiful pieces."
                      : "Try adjusting your search or filters to find what you're looking for."
                    }
                  </p>
                  {allProducts.length === 0 ? (
                    <a
                      href="/"
                      className="inline-block text-primary hover:underline"
                    >
                      Browse All Products
                    </a>
                  ) : (
                    <Button onClick={resetFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
