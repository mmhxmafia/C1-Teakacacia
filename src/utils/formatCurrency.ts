/**
 * Format currency in Indian Rupee format with proper comma placement
 * Indian format: 1,00,000 (lakhs system)
 * 
 * @param amount - The amount to format
 * @param includeDecimals - Whether to include decimal places (default: true)
 * @returns Formatted currency string with ₹ symbol
 */
export const formatCurrency = (amount: number | string, includeDecimals: boolean = true): string => {
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numAmount)) {
    return '₹0.00';
  }

  // Format with Indian number system
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });

  return formatter.format(numAmount);
};

/**
 * Format number with Indian comma system (without currency symbol)
 * 
 * @param amount - The amount to format
 * @param includeDecimals - Whether to include decimal places (default: true)
 * @returns Formatted number string
 */
export const formatNumber = (amount: number | string, includeDecimals: boolean = true): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0';
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });

  return formatter.format(numAmount);
};

/**
 * Format price for display (removes .00 if whole number)
 * 
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatPrice = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '₹0';
  }

  // Check if it's a whole number
  const isWholeNumber = numAmount % 1 === 0;
  
  return formatCurrency(numAmount, !isWholeNumber);
};
