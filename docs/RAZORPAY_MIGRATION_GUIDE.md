# 💳 COMPLETE RAZORPAY MIGRATION GUIDE
## From WhatsApp Orders to Razorpay Payment Gateway

**Current Status:** WhatsApp Order System (Temporary)  
**Target:** Razorpay Payment Integration  
**Last Updated:** November 8, 2025

---

## 🎯 OVERVIEW

### What Was Changed for WhatsApp

**3 Files Modified:**
1. `src/components/ShippingInfo.tsx` - Removed GraphQL, added static info
2. `src/pages/Checkout.tsx` - Removed WooCommerce, added WhatsApp
3. `src/pages/ProductDetail.tsx` - Commented notification

**What Was Removed:**
- GraphQL queries (GET_SHIPPING_SETTINGS)
- GraphQL mutations (CREATE_ORDER)
- WooCommerce order creation
- Dynamic shipping calculation
- Razorpay payment integration

**What Was Added:**
- WhatsApp message generation
- Static shipping calculation (₹50,000 free, else ₹111)
- WhatsApp redirect (window.open)
- Green WhatsApp UI theme

---

## 📋 FILES MODIFIED FOR WHATSAPP

### **FILE 1: src/components/ShippingInfo.tsx**

#### Current State (WhatsApp):
```typescript
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
      {/* Static free shipping and standard delivery */}
    </div>
  );
};
```

#### What to Restore:
- Add back: `import { useQuery } from '@apollo/client/react';`
- Add back: `import { gql } from '@apollo/client';`
- Add back: `const GET_SHIPPING_SETTINGS = gql\`...\``
- Add back: `const { data, loading, error } = useQuery(GET_SHIPPING_SETTINGS);`
- Add back: Dynamic shipping method rendering

---

### **FILE 2: src/pages/Checkout.tsx**

#### A. Imports (Lines 1-16)

**Current (WhatsApp):**
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
// ... other imports
// NO GraphQL imports
```

**Restore (Razorpay):**
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';  // ADD
import { gql } from '@apollo/client';  // ADD
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CREATE_ORDER } from '@/lib/woocommerceMutations';  // ADD
// ... other imports
```

#### B. GraphQL Query (After imports)

**Add This:**
```typescript
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
      }
    }
  }
`;
```

#### C. Component State (Line ~23)

**Current (WhatsApp):**
```typescript
const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  // NO GraphQL hooks
```

**Restore (Razorpay):**
```typescript
const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [createOrder] = useMutation(CREATE_ORDER);  // ADD
  const { data: shippingData } = useQuery(GET_SHIPPING_SETTINGS);  // ADD
```

#### D. handleSubmit Function (Lines 91-172)

**Current (WhatsApp) - REMOVE THIS:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    const orderNumber = `ORD-${Date.now()}`;
    const orderDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create WhatsApp message
    const whatsappMessage = `...`;
    const whatsappNumber = '918590774213';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // ... prepare orderData
    clearCart();
    
    toast({
      title: "Order prepared successfully\!",
      description: "Redirecting to WhatsApp...",
    });

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      navigate('/order-confirmation', { state: orderData });
    }, 1500);

  } catch (error: any) {
    // ...
  }
};
```

**Replace With (Razorpay) - ADD THIS:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    // Prepare line items for WooCommerce
    const lineItems = items.map(item => ({
      productId: parseInt(item.id),
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
          paymentMethod: 'razorpay',
          paymentMethodTitle: 'Razorpay',
          customerNote: formData.notes || 'Order placed via frontend',
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

      // Prepare order data
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

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: finalTotal * 100, // Amount in paise
        currency: 'INR',
        name: 'Edakkattu Furniture',
        description: `Order #${orderData.orderNumber}`,
        order_id: order.databaseId.toString(),
        handler: function (response: any) {
          // Payment successful
          toast({
            title: "Payment successful\!",
            description: `Order #${orderData.orderNumber} has been placed.`,
          });
          
          clearCart();
          navigate('/order-confirmation', { state: orderData });
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#B8860B',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
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
```

#### E. Shipping Calculation (Lines 174-192)

**Current (WhatsApp) - REMOVE THIS:**
```typescript
const totalPrice = getTotalPrice();

// Static shipping calculation for WhatsApp orders
const freeShippingThreshold = 50000;
let shippingCost = 0;
let appliedShippingMethod = '';

if (totalPrice >= freeShippingThreshold) {
  shippingCost = 0;
  appliedShippingMethod = 'Free Shipping';
} else {
  shippingCost = 111;
  appliedShippingMethod = 'Standard Delivery';
}

const taxRate = 0.08;
const tax = totalPrice * taxRate;
```

**Replace With (Razorpay) - ADD THIS:**
```typescript
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
      shippingCost = 0;
      appliedShippingMethod = freeShipping.title;
    }
  }
  
  // If not free shipping, check for flat rate
  if (shippingCost \!== 0 || \!appliedShippingMethod) {
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

const taxRate = 0.08;
const tax = totalPrice * taxRate;
```

#### F. Payment Section UI (Lines 392-415)

**Current (WhatsApp) - REMOVE THIS:**
```tsx
<div className="p-6 border-2 border-dashed border-border rounded-lg text-center bg-green-50 dark:bg-green-950/20">
  <div className="flex items-center justify-center gap-2 mb-2">
    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
      {/* WhatsApp icon */}
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
```

**Replace With (Razorpay) - ADD THIS:**
```tsx
<div className="p-6 border-2 border-border rounded-lg bg-muted/30">
  <div className="flex items-center gap-3 mb-4">
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
    <h3 className="font-semibold text-foreground">Secure Payment via Razorpay</h3>
  </div>
  <p className="text-sm text-muted-foreground mb-3">
    Pay securely using your preferred method
  </p>
  <div className="flex gap-2 flex-wrap">
    <span className="text-xs bg-muted px-2 py-1 rounded">Credit Card</span>
    <span className="text-xs bg-muted px-2 py-1 rounded">Debit Card</span>
    <span className="text-xs bg-muted px-2 py-1 rounded">UPI</span>
    <span className="text-xs bg-muted px-2 py-1 rounded">Net Banking</span>
    <span className="text-xs bg-muted px-2 py-1 rounded">Wallets</span>
  </div>
</div>
```

#### G. Submit Button (Lines 419-426)

**Current (WhatsApp) - REMOVE THIS:**
```tsx
<Button 
  type="submit" 
  size="lg" 
  className="w-full bg-green-600 hover:bg-green-700"
  disabled={isProcessing}
>
  {isProcessing ? "Preparing Order..." : "Continue to WhatsApp"}
</Button>
```

**Replace With (Razorpay) - ADD THIS:**
```tsx
<Button 
  type="submit" 
  size="lg" 
  className="w-full"
  disabled={isProcessing}
>
  {isProcessing ? "Processing..." : "Proceed to Payment"}
</Button>
```

---

### **FILE 3: src/pages/ProductDetail.tsx**

#### Line 194-196

**Current (WhatsApp):**
```typescript
addToCart(cartItem);
// Don't show notification when cart auto-opens - user can see the item in cart
// notify.success(notify.messages.addedToCart(product.name));
openCart();
```

**Restore (Razorpay):**
```typescript
addToCart(cartItem);
notify.success(notify.messages.addedToCart(product.name));  // UNCOMMENT THIS
openCart();
```

---

## 🚀 RAZORPAY SETUP

### Step 1: Install Razorpay Package

```bash
npm install razorpay
```

### Step 2: Add Razorpay Script

Add to `public/index.html` before `</body>`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 3: Environment Variables

Add to `.env.local`:

```bash
VITE_GRAPHQL_ENDPOINT="https://admin.teakacacia.com/graphql"
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### Step 4: TypeScript Types

Create `src/types/razorpay.d.ts`:

```typescript
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
  };
}
```

### Step 5: WordPress Setup

1. **Install Plugin:**
   - Go to WordPress Admin
   - Plugins → Add New
   - Search "Razorpay WooCommerce"
   - Install & Activate

2. **Configure:**
   - WooCommerce → Settings → Payments
   - Enable "Razorpay"
   - Click "Manage"
   - Enter Key ID and Key Secret
   - Enable "Test Mode" for testing
   - Save changes

3. **Test:**
   - Use test credentials
   - Make a test purchase
   - Verify order in WordPress

4. **Go Live:**
   - Switch to live credentials
   - Disable test mode
   - Test with small amount
   - Monitor first few orders

---

## ✅ TESTING CHECKLIST

### Before Deploying:

- [ ] All 3 files updated
- [ ] Razorpay package installed
- [ ] Script added to index.html
- [ ] Environment variables set
- [ ] TypeScript types created
- [ ] WordPress plugin installed
- [ ] Razorpay configured
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors

### After Deploying:

- [ ] Products load correctly
- [ ] Cart works
- [ ] Checkout form works
- [ ] Shipping calculates correctly
- [ ] Razorpay modal opens
- [ ] Test payment succeeds
- [ ] Order confirmation shows
- [ ] Order appears in WordPress
- [ ] Email notifications sent
- [ ] Mobile testing done

---

## 📊 COMPARISON

| Feature | WhatsApp | Razorpay |
|---------|----------|----------|
| **Order Creation** | Frontend only | WooCommerce |
| **Payment** | Manual (later) | Automated (instant) |
| **Order Number** | `ORD-${Date.now()}` | WooCommerce generated |
| **Confirmation** | WhatsApp message | Payment gateway |
| **GraphQL** | None | GET_SHIPPING_SETTINGS, CREATE_ORDER |
| **Dependencies** | None | Razorpay SDK |
| **Env Variables** | None | VITE_RAZORPAY_KEY_ID |
| **Setup Time** | 0 | 2-3 hours |

---

## 🔄 MIGRATION STEPS SUMMARY

1. ✅ Restore ShippingInfo.tsx (add GraphQL)
2. ✅ Update Checkout.tsx (7 changes)
3. ✅ Uncomment ProductDetail.tsx notification
4. ✅ Install Razorpay package
5. ✅ Add Razorpay script
6. ✅ Add environment variables
7. 
