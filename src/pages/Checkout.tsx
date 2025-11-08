import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CREATE_ORDER } from '@/lib/woocommerceMutations';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [createOrder] = useMutation(CREATE_ORDER);
  
  // Fetch shipping settings from WordPress
  const { data: shippingData } = useQuery(GET_SHIPPING_SETTINGS);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  // If cart is empty, redirect to home
  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-font text-4xl font-medium text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checking out.
            </p>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Prepare line items for WooCommerce
      const lineItems = items.map(item => ({
        productId: parseInt(item.id), // Convert to integer
        quantity: item.quantity,
      }));

      // Create order in WooCommerce
      const { data } = await createOrder({
        variables: {
          input: {
            billing: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address1: formData.address,
              city: formData.city,
              state: formData.state,
              postcode: formData.zipCode,
              country: formData.country,
              email: formData.email,
              phone: formData.phone,
            },
            shipping: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              address1: formData.address,
              city: formData.city,
              state: formData.state,
              postcode: formData.zipCode,
              country: formData.country,
            },
            lineItems: lineItems,
            paymentMethod: 'pending', // Payment pending
            paymentMethodTitle: 'Payment Pending',
            customerNote: 'Order placed via frontend',
          },
        },
      });

      if (data?.createOrder?.order) {
        const order = data.createOrder.order;
        const orderDate = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Prepare order data for confirmation page
        const orderData = {
          orderNumber: order.orderNumber || order.databaseId.toString(),
          orderDate,
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          items: items,
          pricing: {
            subtotal: totalPrice,
            shipping: shippingCost,
            tax: tax,
            total: finalTotal,
          },
        };

        // Clear the cart
        clearCart();

        // Navigate to order confirmation page
        navigate('/order-confirmation', { state: orderData });

        toast({
          title: "Order placed successfully!",
          description: `Order #${orderData.orderNumber} has been created.`,
        });
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "Order failed",
        description: error.message || "Could not place order. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const totalPrice = getTotalPrice();
  
  // Calculate shipping dynamically from WordPress settings
  let shippingCost = 0;
  let freeShippingThreshold: number | null = null;
  let appliedShippingMethod: string = '';
  
  if (shippingData?.shippingSettings) {
    const allMethods: any[] = [];
    shippingData.shippingSettings.forEach((zone: any) => {
      zone.methods?.forEach((method: any) => {
        if (method.enabled) {
          allMethods.push(method);
        }
      });
    });
    
    // Check for free shipping first
    const freeShipping = allMethods.find(m => m.type === 'free' || m.methodId === 'free_shipping');
    if (freeShipping) {
      if (freeShipping.minAmount) {
        freeShippingThreshold = parseFloat(freeShipping.minAmount);
        if (totalPrice >= freeShippingThreshold) {
          shippingCost = 0;
          appliedShippingMethod = freeShipping.title;
        }
      } else {
        // Free shipping with no minimum
        shippingCost = 0;
        appliedShippingMethod = freeShipping.title;
      }
    }
    
    // If not free shipping, check for flat rate
    if (shippingCost !== 0 || !appliedShippingMethod) {
      const flatRate = allMethods.find(m => m.type === 'flat_rate' || m.methodId === 'flat_rate');
      if (flatRate && flatRate.cost) {
        shippingCost = parseFloat(flatRate.cost);
        appliedShippingMethod = flatRate.title;
      }
    }
  } else {
    // Fallback if plugin not installed
    shippingCost = 50;
    appliedShippingMethod = 'Standard Shipping';
  }
  
  // Tax calculation (can be configured in WooCommerce → Settings → Tax)
  const taxRate = 0.08; // 8% - Configure in WooCommerce settings
  const tax = totalPrice * taxRate;
  
  const finalTotal = totalPrice + shippingCost + tax;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="heading-font text-4xl font-medium text-foreground mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground mb-12">
            Complete your order
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-font text-2xl">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-font text-2xl">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State / Province *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          placeholder="NY"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP / Postal Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method (Placeholder) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-font text-2xl">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 border-2 border-dashed border-border rounded-lg text-center">
                      <p className="text-muted-foreground">
                        Payment integration coming soon
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        For now, we'll process your order as a quote request
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="heading-font text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-sm">{item.price}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Shipping {appliedShippingMethod && `(${appliedShippingMethod})`}
                      </span>
                      <span className="text-foreground font-medium">
                        {shippingCost === 0 ? (
                          <span className="text-green-600 font-semibold">Free</span>
                        ) : (
                          `₹${shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground font-medium">₹{tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-foreground">
                      ₹{finalTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Free shipping message */}
                  {shippingCost === 0 && appliedShippingMethod && (
                    <div className="text-sm text-green-600 text-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      🎉 You qualify for {appliedShippingMethod}!
                    </div>
                  )}
                  
                  {/* Show how much more needed for free shipping */}
                  {freeShippingThreshold && totalPrice < freeShippingThreshold && (
                    <div className="text-sm text-blue-600 text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                      Add ₹{(freeShippingThreshold - totalPrice).toFixed(2)} more for free shipping!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
