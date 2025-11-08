import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

/**
 * Professional skeleton loader for product cards
 * Matches the actual ProductCard layout
 */
const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <AspectRatio ratio={3/4}>
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      
      <CardContent className="p-4 sm:p-6">
        {/* Product name skeleton */}
        <Skeleton className="h-5 sm:h-6 w-3/4 mb-3" />
        
        {/* Price skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 sm:h-5 w-20" />
          <Skeleton className="h-3 sm:h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;
