import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CreditCard } from "lucide-react";

interface ProductCardProps {
  product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl = product?.featuredImage?.node?.sourceUrl;
  const productName = product?.name || 'Untitled Product';
  const productSlug = product?.slug || '#';
  
  // Format price display - handle all possible price scenarios
  const regularPrice = product?.regularPrice;
  const salePrice = product?.salePrice;
  const price = product?.price;
  
  // Stock status
  const stockStatus = product?.stockStatus;
  const stockQuantity = product?.stockQuantity;
  
  // Determine what price to show
  const displayPrice = price || regularPrice || 'Price on request';
  const hasDiscount = salePrice && regularPrice && salePrice !== regularPrice;

  return (
    <Link 
      to={`/products/${productSlug}`}
      className="group block"
    >
      <Card className="overflow-hidden border-border bg-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
        <AspectRatio ratio={3/4} className="relative">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={productName}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              {/* EMI Available Badge */}
              <div className="absolute top-3 left-3 bg-[#8B4513] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 backdrop-blur-sm bg-opacity-90">
                <CreditCard className="h-3.5 w-3.5" />
                <span>EMI Available</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
              <span className="text-muted-foreground/20 heading-font text-2xl">
                {productName}
              </span>
            </div>
          )}
        </AspectRatio>
        
        <CardContent className="p-4 sm:p-6">
          <h3 className="heading-font text-base sm:text-lg md:text-xl font-medium text-foreground mb-2 transition-colors group-hover:text-primary line-clamp-2">
            {productName}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {hasDiscount ? (
              <>
                <p className="text-primary font-semibold tracking-wide text-base sm:text-lg">
                  {salePrice}
                </p>
                <p className="text-muted-foreground font-medium tracking-wide line-through text-xs sm:text-sm">
                  {regularPrice}
                </p>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 sm:py-1 rounded font-semibold">
                  SALE
                </span>
              </>
            ) : (
              <p className="text-muted-foreground font-medium tracking-wide text-sm sm:text-base">
                {displayPrice}
              </p>
            )}
            
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
