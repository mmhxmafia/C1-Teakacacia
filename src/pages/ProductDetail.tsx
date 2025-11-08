import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductVariations from "@/components/ProductVariations";
import ErrorDisplay from "@/components/ErrorDisplay";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/hooks/use-notification";
import SEO from "@/components/SEO";
import ShippingInfo from "@/components/ShippingInfo";
import { ZoomIn } from "lucide-react";
import { formatPrice, getVariationPrice, getVariationName, validateProduct, logError, getCustomerErrorMessage } from "@/utils/dataHelpers";

// GraphQL query to fetch product by slug - supports both Simple and Variable products
const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      name
      slug
      type
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        description
        weight
        length
        width
        height
        shippingClassId
        shippingClasses {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        description
        defaultAttributes {
          nodes {
            name
            value
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
          }
        }
        variations {
          nodes {
            id
            name
            price
            regularPrice
            salePrice
            stockQuantity
            image {
              sourceUrl
              altText
            }
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`;

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
  });
  const { addToCart, openCart } = useCart();
  const notify = useNotification();
  const product = data?.product;
  
  // Image gallery state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Variation state for variable products
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  
  // Auto-select default variation from WordPress settings
  useEffect(() => {
    if (product?.type === 'VARIABLE' && product?.defaultAttributes?.nodes && product?.variations?.nodes) {
      const defaultAttrs = product.defaultAttributes.nodes;
      
      // Find variation that matches all default attributes
      const defaultVariation = product.variations.nodes.find((variation: any) => {
        return defaultAttrs.every((defaultAttr: any) => {
          return variation.attributes.nodes.some((varAttr: any) => 
            varAttr.name === defaultAttr.name && 
            varAttr.value.toLowerCase() === defaultAttr.value.toLowerCase()
          );
        });
      });
      
      if (defaultVariation && !selectedVariation) {
        setSelectedVariation(defaultVariation);
        // Update image if default variation has one
        if (defaultVariation.image?.sourceUrl) {
          setSelectedImage(defaultVariation.image.sourceUrl);
        }
      }
    }
  }, [product, selectedVariation]);
  
  // Get all images (featured + gallery)
  const allImages = product ? [
    product.featuredImage?.node,
    ...(product.galleryImages?.nodes || [])
  ].filter(Boolean) : [];
  
  // Set selected image to first image when product loads
  const currentImage = selectedImage || allImages[0]?.sourceUrl || product?.featuredImage?.node?.sourceUrl;

  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    if (!product) {
      logError('Add to Cart', 'Product not found');
      notify.error('Unable to add to cart. Please try again.');
      return;
    }

    try {
      // Validate product data
      const validation = validateProduct(product);
      if (!validation.isValid) {
        logError('Product Validation Failed', validation.errors);
        notify.error('This product has incomplete information. Please contact us.');
        return;
      }
      
      // For variable products, use selected variation data
      const isVariable = product.type === 'VARIABLE';
      const cartItem = isVariable && selectedVariation ? {
        id: selectedVariation.id,
        slug: product.slug,
        name: getVariationName(product.name, selectedVariation),
        price: getVariationPrice(selectedVariation),
        image: selectedVariation.image?.sourceUrl || product.featuredImage?.node?.sourceUrl || '',
      } : {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: formatPrice(product.price),
        image: product.featuredImage?.node?.sourceUrl || '',
      };
      
      addToCart(cartItem);
      // Don't show notification when cart auto-opens - user can see the item in cart
      // notify.success(notify.messages.addedToCart(product.name));
      openCart(); // Auto-open cart after adding item
    } catch (error) {
      logError('Add to Cart Failed', error);
      notify.error('Unable to add to cart. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {product && (
        <SEO 
          title={`${product.name} - Premium Teak Wood Furniture`}
          description={product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Buy ${product.name} - Premium handcrafted teak wood furniture. High quality, sustainable materials, and timeless design.`}
          keywords={`${product.name}, teak furniture, buy ${product.name}, wooden furniture, premium furniture`}
          ogImage={product.featuredImage?.node?.sourceUrl}
          ogType="product"
          product={{
            name: product.name,
            price: product.price?.replace(/[^0-9.]/g, '') || '0',
            currency: 'INR',
            image: product.featuredImage?.node?.sourceUrl || '',
            availability: 'InStock',
          }}
        />
      )}
      <Navigation />
      
      <main className="pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-muted animate-pulse rounded-sm" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted animate-pulse rounded-sm" />
                  ))}
                </div>
              </div>
              
              {/* Details Skeleton */}
              <div className="space-y-6">
                <div className="h-12 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-8 bg-muted animate-pulse rounded w-1/4" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                </div>
                <div className="h-12 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-2xl mx-auto py-16">
              <ErrorDisplay
                title="Unable to Load Product"
                message={getCustomerErrorMessage(error)}
                onRetry={() => window.location.reload()}
                technical={error}
              />
              <div className="mt-8 text-center">
                <Button asChild>
                  <a href="/">Browse All Products</a>
                </Button>
              </div>
            </div>
          )}

          {/* Product Details */}
          {!loading && !error && product && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image with Hover Zoom */}
                <div className="relative">
                  <div
                    className="relative overflow-hidden rounded-lg border border-border cursor-crosshair"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onMouseMove={handleMouseMove}
                  >
                    <AspectRatio ratio={1}>
                      {currentImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={currentImage}
                            alt={product.name}
                            className="object-cover w-full h-full"
                            style={{
                              transform: isHovering ? 'scale(2)' : 'scale(1)',
                              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                              transition: isHovering ? 'none' : 'transform 0.3s ease',
                            }}
                          />
                          {/* Zoom Indicator */}
                          {!isHovering && (
                            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full">
                              <ZoomIn className="h-5 w-5 text-foreground" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
                          <span className="text-6xl text-muted-foreground/20 heading-font">
                            {product.name}
                          </span>
                        </div>
                      )}
                    </AspectRatio>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {allImages.map((image: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image.sourceUrl)}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 hover:border-primary ${
                          (selectedImage === image.sourceUrl || (!selectedImage && index === 0))
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border'
                        }`}
                      >
                        <img
                          src={image.sourceUrl}
                          alt={image.altText || `${product.name} - View ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Image Counter */}
                {allImages.length > 1 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {allImages.findIndex(img => img.sourceUrl === (selectedImage || allImages[0]?.sourceUrl)) + 1} / {allImages.length}
                  </p>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-8">
                <div>
                  <h1 className="heading-font text-4xl sm:text-5xl font-medium text-foreground mb-4 tracking-tight">
                    {product.name}
                  </h1>
                  
                  {/* Price Display - Only for Simple Products */}
                  {product.type !== 'VARIABLE' && (
                    <div className="flex items-center gap-4 flex-wrap mb-4">
                      {product.salePrice && product.regularPrice && product.salePrice !== product.regularPrice ? (
                        <>
                          <p className="text-4xl text-primary font-semibold">
                            {formatPrice(product.salePrice)}
                          </p>
                          <p className="text-2xl text-muted-foreground font-medium line-through">
                            {formatPrice(product.regularPrice)}
                          </p>
                          <span className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded font-semibold">
                            SALE
                          </span>
                        </>
                      ) : (
                        <p className="text-4xl text-foreground font-semibold">
                          {formatPrice(product.price || product.regularPrice)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Variations Selector - For Variable Products */}
                {product.type === 'VARIABLE' && product.variations?.nodes && (
                  <ProductVariations 
                    variations={product.variations.nodes}
                    selectedVariation={selectedVariation}
                    onVariationSelect={(variation) => {
                      setSelectedVariation(variation);
                      // Update image if variation has one
                      if (variation?.image?.sourceUrl) {
                        setSelectedImage(variation.image.sourceUrl);
                      }
                    }}
                  />
                )}

                <div className="prose prose-lg max-w-none">
                  <div
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
                  />
                </div>

                {/* Product Specifications - Dimensions & Weight */}
                {(product.weight || product.length || product.width || product.height) && (
                  <div className="border border-border rounded-lg p-6 bg-muted/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Product Specifications</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {/* Dimensions */}
                      {(product.length || product.width || product.height) && (
                        <div>
                          <p className="text-muted-foreground mb-1">Dimensions (L × W × H)</p>
                          <p className="font-medium text-foreground">
                            {product.length && `${product.length} cm`}
                            {product.width && ` × ${product.width} cm`}
                            {product.height && ` × ${product.height} cm`}
                          </p>
                        </div>
                      )}
                      
                      {/* Weight */}
                      {product.weight && (
                        <div>
                          <p className="text-muted-foreground mb-1">Weight</p>
                          <p className="font-medium text-foreground">{product.weight} kg</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto px-12"
                    onClick={handleAddToCart}
                    disabled={product.type === 'VARIABLE' && !selectedVariation}
                  >
                    {product.type === 'VARIABLE' && !selectedVariation 
                      ? 'Please Select an Option' 
                      : 'Add to Cart'
                    }
                  </Button>
                </div>

                {/* Dynamic Shipping Info from WooCommerce Settings */}
                <ShippingInfo 
                  productWeight={product.weight}
                  productPrice={product.price}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
