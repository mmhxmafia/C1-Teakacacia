/**
 * Data validation and fallback utilities
 * Provides customer-friendly handling of missing or invalid data
 */

/**
 * Format price with fallback for missing prices
 */
export const formatPrice = (price: string | null | undefined, fallback: string = "Contact for Price"): string => {
  if (!price || price === '' || price === '0' || price === '0.00') {
    return fallback;
  }
  return price;
};

/**
 * Get variation price with proper fallbacks
 */
export const getVariationPrice = (variation: any): string => {
  const price = variation?.price || variation?.salePrice || variation?.regularPrice;
  return formatPrice(price, "Price on Request");
};

/**
 * Validate product has required data
 */
export const validateProduct = (product: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!product) {
    errors.push("Product data not found");
    return { isValid: false, errors };
  }

  if (!product.name) {
    errors.push("Product name missing");
  }

  if (!product.slug) {
    errors.push("Product URL missing");
  }

  // Price is optional - we have fallback messages
  // Image is optional - we show placeholder

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get product image with fallback
 */
export const getProductImage = (product: any): string | null => {
  return (
    product?.featuredImage?.node?.sourceUrl ||
    product?.image?.sourceUrl ||
    product?.galleryImages?.nodes?.[0]?.sourceUrl ||
    null
  );
};

/**
 * Validate variation has required data
 */
export const validateVariation = (variation: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!variation) {
    errors.push("Variation not found");
    return { isValid: false, errors };
  }

  if (!variation.id) {
    errors.push("Variation ID missing");
  }

  if (!variation.attributes?.nodes || variation.attributes.nodes.length === 0) {
    errors.push("Variation attributes missing");
  }

  // Price is optional - we handle with formatPrice
  // Stock is optional - we handle separately

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check if variation is in stock
 */
export const isVariationInStock = (variation: any): boolean => {
  if (variation?.stockStatus === 'OUT_OF_STOCK') return false;
  if (variation?.stockQuantity !== undefined && variation.stockQuantity <= 0) return false;
  return true;
};

/**
 * Get variation display name
 */
export const getVariationName = (productName: string, variation: any): string => {
  const attributeValue = variation?.attributes?.nodes?.[0]?.value;
  if (attributeValue) {
    return `${productName} - ${attributeValue}`;
  }
  return productName;
};

/**
 * Log error for developers without exposing to customers
 */
export const logError = (context: string, error: any, additionalInfo?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔴 Error: ${context}`);
    console.error('Error:', error);
    if (additionalInfo) {
      console.log('Additional Info:', additionalInfo);
    }
    console.groupEnd();
  }
  
  // In production, send to error tracking service
  // e.g., Sentry.captureException(error, { extra: { context, additionalInfo } });
};

/**
 * Safe JSON parse with fallback
 */
export const safeJSONParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch (error) {
    logError('JSON Parse Failed', error, { json });
    return fallback;
  }
};

/**
 * Get error message for customers
 */
export const getCustomerErrorMessage = (error: any): string => {
  // Default friendly message
  let message = "We're experiencing technical difficulties. Please try again later.";

  // GraphQL errors
  if (error?.graphQLErrors?.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    if (graphQLError.message.includes('not found')) {
      message = "The item you're looking for could not be found.";
    } else if (graphQLError.message.includes('network')) {
      message = "Connection issue. Please check your internet and try again.";
    }
  }

  // Network errors
  if (error?.networkError) {
    message = "Unable to connect. Please check your internet connection.";
  }

  // Log technical details for developers
  logError('Customer Error', error);

  return message;
};
