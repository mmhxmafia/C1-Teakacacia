import { cn } from "@/lib/utils";

interface CurrencyProps {
  amount: number | string;
  className?: string;
  showSymbol?: boolean;
  symbolClassName?: string;
}

export const Currency = ({ 
  amount, 
  className,
  showSymbol = true,
  symbolClassName 
}: CurrencyProps) => {
  const numericAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) 
    : amount;
  
  const formattedAmount = numericAmount.toFixed(2);
  
  return (
    <span className={cn("font-medium", className)}>
      {showSymbol && (
        <span className={cn("font-normal", symbolClassName)}>₹</span>
      )}
      {formattedAmount}
    </span>
  );
};

export const formatCurrency = (amount: number | string): string => {
  const numericAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) 
    : amount;
  
  return `₹${numericAmount.toFixed(2)}`;
};
