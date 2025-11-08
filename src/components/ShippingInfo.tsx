import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Truck, PackageCheck, MapPin, Store } from 'lucide-react';

// Query to get shipping settings from WordPress
const GET_SHIPPING_SETTINGS = gql`
  query GetShippingSettings {
    shippingSettings {
      id
      name
      methods {
        id
        title
        methodId
        type
        cost
        minAmount
        enabled
      }
    }
  }
`;

interface ShippingInfoProps {
  productWeight?: string;
  productPrice?: string;
}

const ShippingInfo = ({ productWeight, productPrice }: ShippingInfoProps) => {
  const { data, loading, error } = useQuery(GET_SHIPPING_SETTINGS);

  if (loading) {
    return (
      <div className="border border-border rounded-lg p-6 bg-muted/30 animate-pulse">
        <div className="h-6 bg-muted rounded w-32 mb-4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
      </div>
    );
  }

  // If error or no data, show fallback
  if (error || !data?.shippingSettings) {
    return (
      <div className="border border-border rounded-lg p-6 bg-muted/30">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Shipping Information</h3>
            <p className="text-sm text-muted-foreground">
              Shipping costs calculated at checkout based on your location.
            </p>
            <p className="text-xs text-orange-600 mt-2">
              Note: Install the TeakAcacia Shipping GraphQL plugin in WordPress to show dynamic shipping info.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get all shipping zones and methods
  const shippingZones = data.shippingSettings || [];
  const allMethods: any[] = [];

  shippingZones.forEach((zone: any) => {
    zone.methods?.forEach((method: any) => {
      if (method.enabled) {
        allMethods.push({
          ...method,
          zoneName: zone.name,
        });
      }
    });
  });

  if (allMethods.length === 0) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg p-6 bg-muted/30">
      <div className="flex items-start gap-3 mb-4">
        <Truck className="h-5 w-5 text-primary mt-0.5" />
        <h3 className="font-semibold text-foreground">Shipping & Delivery</h3>
      </div>

      <div className="space-y-3">
        {allMethods.map((method, index) => {
          // Free Shipping
          if (method.type === 'free' || method.methodId === 'free_shipping') {
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                <PackageCheck className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    {method.title}
                  </p>
                  {method.minAmount ? (
                    <p className="text-green-700 dark:text-green-300 mt-1">
                      On orders over ₹{method.minAmount}
                    </p>
                  ) : (
                    <p className="text-green-700 dark:text-green-300 mt-1">
                      Free delivery on this product
                    </p>
                  )}
                  {method.zoneName && (
                    <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                      Available in: {method.zoneName}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Flat Rate
          if (method.type === 'flat_rate' || method.methodId === 'flat_rate') {
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {method.title}
                  </p>
                  {method.cost && (
                    <p className="text-blue-700 dark:text-blue-300 mt-1">
                      ₹{method.cost} flat rate delivery
                    </p>
                  )}
                  {method.zoneName && (
                    <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                      Available in: {method.zoneName}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Local Pickup
          if (method.type === 'local_pickup' || method.methodId === 'local_pickup') {
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                <Store className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-purple-900 dark:text-purple-100">
                    {method.title}
                  </p>
                  <p className="text-purple-700 dark:text-purple-300 mt-1">
                    Pickup from our store
                  </p>
                  {method.zoneName && (
                    <p className="text-purple-600 dark:text-purple-400 text-xs mt-1">
                      Location: {method.zoneName}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Other methods
          return (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg border border-border">
              <Truck className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {method.title}
                </p>
                {method.cost && (
                  <p className="text-muted-foreground mt-1">
                    ₹{method.cost}
                  </p>
                )}
                {method.zoneName && (
                  <p className="text-muted-foreground text-xs mt-1">
                    Available in: {method.zoneName}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
        Final shipping cost calculated at checkout based on your delivery address
      </p>
    </div>
  );
};

export default ShippingInfo;
