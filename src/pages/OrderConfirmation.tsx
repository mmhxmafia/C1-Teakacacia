import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Mail, Phone, MapPin } from "lucide-react";

interface OrderData {
  orderNumber: string;
  orderDate: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    image: string;
  }>;
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state as OrderData;

  // Redirect to home if no order data
  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const { orderNumber, orderDate, customerInfo, shippingAddress, items, pricing } = orderData;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h1 className="heading-font text-4xl sm:text-5xl font-medium text-foreground mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Thank you for your order, {customerInfo.firstName}!
            </p>
            <p className="text-muted-foreground">
              We've received your order and will send you a confirmation email shortly.
            </p>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Order Number</p>
                    <p className="text-lg heading-font text-primary">{orderNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Order Date</p>
                    <p className="text-muted-foreground">{orderDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="heading-font text-2xl">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="text-foreground">{customerInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="text-foreground">{customerInfo.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="heading-font text-2xl">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-foreground">{shippingAddress.address}</p>
                  <p className="text-foreground">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                  <p className="text-foreground">{shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="heading-font text-2xl">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">{item.price}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="heading-font text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-foreground">
                <span>Subtotal</span>
                <span>₹{pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Shipping</span>
                <span>
                  {pricing.shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹${pricing.shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Tax</span>
                <span>₹{pricing.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-foreground">Total</span>
                <span className="text-2xl heading-font font-medium text-primary">
                  ₹{pricing.total.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="heading-font text-2xl">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium text-foreground">Order Confirmation Email</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a confirmation email at {customerInfo.email} with your order details.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium text-foreground">Order Processing</p>
                  <p className="text-sm text-muted-foreground">
                    Our team will start processing your order within 24-48 hours.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium text-foreground">Shipping Updates</p>
                  <p className="text-sm text-muted-foreground">
                    We'll send you tracking information once your order ships.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.print()}>
              Print Order Details
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
