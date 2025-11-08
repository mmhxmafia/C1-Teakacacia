import { Truck, PackageCheck, MapPin } from 'lucide-react';

// Static shipping info for WhatsApp orders
// When migrating to Razorpay, restore GraphQL query from PAYMENT_MIGRATION_GUIDE.md

interface ShippingInfoProps {
  productWeight?: string;
  productPrice?: string;
}

const ShippingInfo = ({ productWeight, productPrice }: ShippingInfoProps) => {

  return (
    <div className="border border-border rounded-lg p-6 bg-muted/30">
      <div className="flex items-start gap-3 mb-4">
        <Truck className="h-5 w-5 text-primary mt-0.5" />
        <h3 className="font-semibold text-foreground">Shipping & Delivery</h3>
      </div>

      <div className="space-y-3">
        {/* Free Shipping */}
        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
          <PackageCheck className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-900 dark:text-green-100">
              Free Shipping
            </p>
            <p className="text-green-700 dark:text-green-300 mt-1">
              On orders over ₹50,000
            </p>
            <p className="text-green-600 dark:text-green-400 text-xs mt-1">
              Available across India
            </p>
          </div>
        </div>

        {/* Standard Shipping */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Standard Delivery
            </p>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              ₹111 flat rate delivery
            </p>
            <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
              Delivery in 5-7 business days
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
        Final shipping cost will be discussed via WhatsApp based on your location
      </p>
    </div>
  );
};

export default ShippingInfo;
