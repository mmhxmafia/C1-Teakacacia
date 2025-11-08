import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Variation {
  id: string;
  name: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  stockQuantity: number;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
  attributes: {
    nodes: Array<{
      name: string;
      value: string;
    }>;
  };
}

interface ProductVariationsProps {
  variations: Variation[];
  selectedVariation: Variation | null;
  onVariationSelect: (variation: Variation | null) => void;
}

/**
 * Component to display and select product variations
 * Shows attributes (size, color, etc.) and updates price/stock based on selection
 */
const ProductVariations = ({ variations, selectedVariation, onVariationSelect }: ProductVariationsProps) => {
  const handleVariationChange = (variationId: string) => {
    const variation = variations.find(v => v.id === variationId);
    if (variation) {
      onVariationSelect(variation);
    }
  };

  if (!variations || variations.length === 0) {
    return null;
  }

  // Get attribute name (e.g., "Size", "Color")
  const attributeName = variations[0]?.attributes?.nodes?.[0]?.name || "Option";

  return (
    <div className="space-y-6">
      {/* Attribute Selector */}
      <div className="space-y-3">
        <Label className="text-base font-medium">{attributeName}</Label>
        <RadioGroup
          value={selectedVariation?.id || ""}
          onValueChange={handleVariationChange}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {variations.map((variation) => {
            const attributeValue = variation.attributes.nodes[0]?.value || "";
            const isOutOfStock = variation.stockQuantity <= 0;
            const isSelected = selectedVariation?.id === variation.id;

            return (
              <div key={variation.id}>
                <RadioGroupItem
                  value={variation.id}
                  id={variation.id}
                  className="peer sr-only"
                  disabled={isOutOfStock}
                />
                <Label
                  htmlFor={variation.id}
                  className={`
                    flex flex-col items-center justify-center rounded-md border-2 
                    px-4 py-3 cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                    }
                    ${isOutOfStock 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                    }
                  `}
                >
                  <span className="font-medium text-sm">
                    {attributeValue}
                  </span>
                  {isOutOfStock && (
                    <span className="text-xs text-destructive mt-1">
                      Out of Stock
                    </span>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* Selected Variation Info */}
      {selectedVariation && (
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <div className="space-y-2">
            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Price:</span>
              <div className="flex items-center gap-2">
                {selectedVariation.salePrice && 
                 selectedVariation.regularPrice && 
                 selectedVariation.salePrice !== selectedVariation.regularPrice ? (
                  <>
                    <span className="text-2xl font-semibold text-primary">
                      {selectedVariation.salePrice}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {selectedVariation.regularPrice}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">
                      SALE
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-semibold text-foreground">
                    {selectedVariation.price || selectedVariation.regularPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Availability:</span>
              <span className={`text-sm font-medium ${
                selectedVariation.stockQuantity > 0 
                  ? 'text-green-600' 
                  : 'text-destructive'
              }`}>
                {selectedVariation.stockQuantity > 0 
                  ? `In Stock (${selectedVariation.stockQuantity} available)` 
                  : 'Out of Stock'
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariations;
