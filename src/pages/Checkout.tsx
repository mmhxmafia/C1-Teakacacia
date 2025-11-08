import { useState, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatCurrency";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCart();
  const { user, register, login } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form state - auto-fill from user if logged in
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    notes: '',
  });

  // Auto-fill form when user logs in
  useEffect(() => {
    if (user) {
      // Load saved address from localStorage
      const savedAddress = localStorage.getItem(`address_${user.email}`);
      
      if (savedAddress) {
        const addressData = JSON.parse(savedAddress);
        setHasSavedAddress(true);
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || prev.firstName,
          lastName: user.lastName || prev.lastName,
          email: user.email || prev.email,
          phone: addressData.phone || prev.phone,
          address: addressData.address || prev.address,
          city: addressData.city || prev.city,
          state: addressData.state || prev.state,
          zipCode: addressData.zipCode || prev.zipCode,
          country: addressData.country || prev.country,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || prev.firstName,
          lastName: user.lastName || prev.lastName,
          email: user.email || prev.email,
        }));
      }
    }
  }, [user]);

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
    
    // If user is not logged in, create account first
    if (!user) {
      await handleCreateAccount();
      return;
    }
    
    // If logged in, proceed with WhatsApp order
    setIsProcessing(true);

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      const orderDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Create WhatsApp message with clean formatting
      const whatsappMessage = `*NEW ORDER - ${orderNumber}*
Date: ${orderDate}

*CUSTOMER DETAILS*
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}

*SHIPPING ADDRESS*
${formData.address}
${formData.city}, ${formData.state} ${formData.zipCode}
${formData.country}

*ORDER ITEMS*
${items.map((item, index) => `${index + 1}. ${item.name}
   Qty: ${item.quantity} x ${formatCurrency(parseFloat(item.price))}`).join('\n\n')}

*PRICING SUMMARY*
Subtotal: ${formatCurrency(totalPrice)}
Shipping: ${shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
Tax: ${formatCurrency(tax)}
---------------------------
*TOTAL: ${formatCurrency(finalTotal)}*

*CUSTOMER NOTES*
${formData.notes || 'No additional notes'}

_Order placed via Edakkattu Furniture Website_
_Please confirm to process this order_`.trim();

      // WhatsApp business number (replace with your actual number)
      const whatsappNumber = '918590774213'; // +91 8590774213
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      // Prepare order data for confirmation page
      const orderData = {
        orderNumber,
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

      // Save address to localStorage for future use
      if (user) {
        const addressToSave = {
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        };
        localStorage.setItem(`address_${user.email}`, JSON.stringify(addressToSave));
      }

      // Clear the cart
      clearCart();

      // Show loading message
      setLoadingMessage('Preparing your order...');
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingMessage('Opening WhatsApp...');
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoadingMessage('Redirecting...');
      
      // Navigate to confirmation page
      setTimeout(() => {
        navigate('/order-confirmation', { state: orderData });
      }, 500);

    } catch (error: any) {
      console.error('Order preparation error:', error);
      toast({
        title: "Order failed",
        description: error.message || "Could not prepare order. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setLoadingMessage('');
    }
  };

  const handleCreateAccount = async () => {
    setIsProcessing(true);
    setLoadingMessage('Checking your email...');

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "Missing Information",
          description: "Please fill in your name and email.",
          variant: "destructive",
        });
        setIsProcessing(false);
        setLoadingMessage('');
        return;
      }

      // Check if email already exists by attempting to create account
      // If it fails with "already exists" error, show login prompt
      const password = `Temp${Date.now()}!`;
      setTempPassword(password);

      setLoadingMessage('Creating your account...');
      
      try {
        await register(formData.email, password, formData.firstName, formData.lastName);

        setAccountCreated(true);
        setLoadingMessage('');
        
        toast({
          title: "Account Created!",
          description: "Please click 'Login & Continue' to complete your order.",
        });

        setIsProcessing(false);
      } catch (registerError: any) {
        // Check if error is because email already exists
        const errorMessage = registerError.message?.toLowerCase() || '';
        
        if (errorMessage.includes('already') || errorMessage.includes('exists') || errorMessage.includes('registered')) {
          setIsProcessing(false);
          setLoadingMessage('');
          
          // Show dialog prompting user to login
          toast({
            title: "Account Already Exists",
            description: "This email is already registered. Please login to continue.",
            variant: "destructive",
          });
          
          // Pre-fill login email and show modal
          setLoginEmail(formData.email);
          setShowLoginModal(true);
        } else {
          throw registerError;
        }
      }
    } catch (error: any) {
      console.error('Account creation error:', error);
      toast({
        title: "Account Creation Failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setLoadingMessage('');
    }
  };

  const handleLoginAndContinue = async () => {
    setIsProcessing(true);
    setLoadingMessage('Logging you in...');

    try {
      await login(formData.email, tempPassword);
      
      setLoadingMessage('');
      
      toast({
        title: "Logged In!",
        description: "Now you can complete your order.",
      });

      setIsProcessing(false);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Could not log in. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setLoadingMessage('');
    }
  };

  const totalPrice = getTotalPrice();
  
  // Static shipping calculation for WhatsApp orders
  // When migrating to Razorpay, restore dynamic calculation from PAYMENT_MIGRATION_GUIDE.md
  const freeShippingThreshold = 50000; // Free shipping over ₹50,000
  let shippingCost = 0;
  let appliedShippingMethod = '';
  
  if (totalPrice >= freeShippingThreshold) {
    shippingCost = 0;
    appliedShippingMethod = 'Free Shipping';
  } else {
    shippingCost = 111;
    appliedShippingMethod = 'Standard Delivery';
  }
  
  // Tax calculation
  const taxRate = 0.08; // 8%
  const tax = totalPrice * taxRate;
  
  const finalTotal = totalPrice + shippingCost + tax;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="heading-font text-4xl font-medium text-foreground mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground mb-8">
            Complete your order
          </p>

          {/* Login Prompt for Non-Logged In Users */}
          {!user && (
            <Card className="mb-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Already have an account?
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Login to auto-fill your details and checkout faster
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                  >
                    Login to Auto-Fill
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message for Logged In Users */}
          {user && hasSavedAddress && (
            <Card className="mb-8 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 text-white p-2 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Welcome back, {user.firstName}!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your saved details have been auto-filled. Review and continue to checkout.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-font text-2xl">Contact Information</CardTitle>
                    {!user && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Don't have an account? No problem! We'll create one for you automatically.
                      </p>
                    )}
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
                    <div className="flex items-center justify-between">
                      <CardTitle className="heading-font text-2xl">Shipping Address</CardTitle>
                      {user && hasSavedAddress && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          ✓ Saved Address
                        </span>
                      )}
                    </div>
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
                    <div className="p-6 border-2 border-dashed border-border rounded-lg text-center bg-green-50 dark:bg-green-950/20">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <p className="font-semibold text-green-700 dark:text-green-400">
                          WhatsApp Order System
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Payment integration coming soon
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        For now, we'll process your order via WhatsApp
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        You'll be redirected to WhatsApp with your order details
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {!user && !accountCreated && (
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Creating Account..." : "Create Account & Continue"}
                  </Button>
                )}

                {!user && accountCreated && (
                  <Button 
                    type="button"
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isProcessing}
                    onClick={handleLoginAndContinue}
                  >
                    {isProcessing ? "Logging In..." : "Login & Continue"}
                  </Button>
                )}

                {user && (
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Preparing Order..." : "Continue to WhatsApp"}
                  </Button>
                )}
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
                      <span className="text-foreground font-medium">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Shipping {appliedShippingMethod && `(${appliedShippingMethod})`}
                      </span>
                      <span className="text-foreground font-medium">
                        {shippingCost === 0 ? (
                          <span className="text-green-600 font-semibold">Free</span>
                        ) : (
                          formatCurrency(shippingCost)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground font-medium">{formatCurrency(tax)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-foreground">
                      {formatCurrency(finalTotal)}
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
                      Add {formatCurrency(freeShippingThreshold - totalPrice)} more for free shipping!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="heading-font text-2xl">Login to Continue</DialogTitle>
            <DialogDescription>
              Login to auto-fill your details and complete checkout faster
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoggingIn(true);
            try {
              await login(loginEmail, loginPassword);
              setShowLoginModal(false);
              toast({
                title: "Welcome back!",
                description: "Your details have been auto-filled.",
              });
            } catch (error: any) {
              toast({
                title: "Login Failed",
                description: error.message || "Invalid email or password.",
                variant: "destructive",
              });
            } finally {
              setIsLoggingIn(false);
            }
          }} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLoginModal(false)}
                className="flex-1"
                disabled={isLoggingIn}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Don't have an account? Fill the form below to create one.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {loadingMessage && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">{loadingMessage}</h3>
            <p className="text-sm text-muted-foreground">Please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
