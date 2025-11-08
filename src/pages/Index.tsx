import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import AboutUs from "@/components/AboutUs";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
// GraphQL query to fetch the latest products - inline all fields
const GET_NEW_ARRIVALS = gql`
  query GetNewArrivals {
    products(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
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
`;

const Index = () => {
  const { loading, error, data } = useQuery(GET_NEW_ARRIVALS);
  const products = data?.products?.nodes || [];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Edakkattu Furniture - Teakacacia | Furniture Wholesaler Kerala & Bangalore"
        description="Premier furniture manufacturer and wholesaler in Kerala and Bangalore, India. Custom sofas and furniture made to your choice. Quality craftsmanship, wholesale and retail."
        keywords="Edakkattu Furniture, furniture wholesaler Kerala, furniture manufacturer Bangalore, custom furniture India, sofa manufacturer, teakacacia, wholesale furniture"
        ogType="website"
      />
      <Navigation />
      
      <main>
        <Hero />
        
        <Categories />
        
        <AboutUs />
        
        {/* New Arrivals Section */}
        <section id="shop" className="py-32 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="h-1 w-16 bg-primary rounded-full mx-auto" />
              </div>
              
              <h2 className="heading-font text-4xl sm:text-5xl font-medium text-foreground mb-6 tracking-tight">
                New Arrivals
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover the latest additions to our collection. Fresh designs that honor traditional craftsmanship while embracing contemporary aesthetics.
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="rounded-sm bg-card border border-border animate-pulse"
                  >
                    <div className="aspect-[3/4] bg-muted" />
                    <div className="p-6">
                      <div className="h-6 bg-muted rounded mb-2 w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty/Error State - Show friendly message */}
            {!loading && (products.length === 0 || error) && (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <span className="text-4xl">🛋️</span>
                </div>
                <h3 className="heading-font text-2xl font-medium text-foreground mb-3">
                  New Products Coming Soon
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
                  We're currently curating our latest collection of handcrafted teak furniture. 
                  Check back soon to discover beautiful pieces for your home.
                </p>
                <p className="text-sm text-muted-foreground">
                  Products will appear here once added to the catalog.
                </p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
