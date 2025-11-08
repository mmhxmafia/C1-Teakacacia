import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState, useMemo } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import LoadingSpinner from "@/components/LoadingSpinner";
import SEO from "@/components/SEO";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// GraphQL query to fetch all products and categories
const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(first: 100) {
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
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
    productCategories(first: 50) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

const Shop = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_PRODUCTS, {
    fetchPolicy: 'network-only', // Always fetch fresh data, ignore cache
    errorPolicy: 'all', // Return partial data even if there's an error
  });
  const allProducts = data?.products?.nodes || [];
  const categories = (data?.productCategories?.nodes || []).filter((cat: any) => 
    cat.name.toLowerCase() !== 'uncategorized'
  );
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.productCategories?.nodes?.some((cat: any) => cat.slug === selectedCategory)
      );
    }
    
    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const priceStr = (product.price || product.regularPrice || '').replace(/[^\d.]/g, '');
        const price = parseFloat(priceStr);
        if (isNaN(price)) return true;
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
          const priceStrA = (a.price || a.regularPrice || '').replace(/[^\d.]/g, '');
          const priceStrB = (b.price || b.regularPrice || '').replace(/[^\d.]/g, '');
          const priceA = parseFloat(priceStrA);
          const priceB = parseFloat(priceStrB);
          if (isNaN(priceA) && isNaN(priceB)) return 0;
          if (isNaN(priceA)) return 1;
          if (isNaN(priceB)) return -1;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceStrA = (a.price || a.regularPrice || '').replace(/[^\d.]/g, '');
          const priceStrB = (b.price || b.regularPrice || '').replace(/[^\d.]/g, '');
          const priceA = parseFloat(priceStrA);
          const priceB = parseFloat(priceStrB);
          if (isNaN(priceA) && isNaN(priceB)) return 0;
          if (isNaN(priceA)) return 1;
          if (isNaN(priceB)) return -1;
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
  }, [allProducts, searchQuery, selectedCategory, priceRange, sortBy]);
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Shop All Products - Teakacacia"
        description="Browse our complete collection of handcrafted teak wood furniture. Premium quality, sustainable materials, and timeless designs."
        keywords="shop furniture, buy teak furniture, wooden furniture store, premium furniture"
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
              Shop All Products
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our complete collection of handcrafted teak and acacia wood furniture.
            </p>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="mb-12">
              <LoadingSpinner size="lg" text="Loading products..." />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {[...Array(8)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive text-lg mb-4">Failed to load products</p>
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => refetch()}>Retry</Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                >
                  Clear Cache & Retry
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                If the issue persists, try signing out and back in.
              </p>
            </div>
          )}
          
          {/* Search and Filters Bar */}
          {!loading && !error && (
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Desktop Filters */}
              <div className="hidden lg:flex gap-4">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name} ({cat.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
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
                
                {(searchQuery || selectedCategory !== 'all' || priceRange !== 'all' || sortBy !== 'default') && (
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
                    {/* Category */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.slug}>
                              {cat.name} ({cat.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
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
                    
                    {(searchQuery || selectedCategory !== 'all' || priceRange !== 'all' || sortBy !== 'default') && (
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
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product?.id || product?.slug} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="heading-font text-2xl font-medium text-foreground mb-3">
                {allProducts.length === 0 ? 'No Products Yet' : 'No Products Found'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {allProducts.length === 0 
                  ? 'Products will appear here once added to the catalog.'
                  : 'Try adjusting your search or filters to find what you\'re looking for.'
                }
              </p>
              {allProducts.length > 0 && (
                <Button onClick={resetFilters} variant="outline">
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
