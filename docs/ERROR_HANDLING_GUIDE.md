# 🛡️ Error Handling System Documentation

## Overview 

Comprehensive customer-friendly error handling system that gracefully handles missing data, validation errors, and system failures while providing useful developer information.

---

## 🎯 **Key Features**

### ✅ **Customer-Friendly**
- Clear, non-technical error messages
- Helpful actions (Retry, Go Home)
- Professional UI presentation
- No scary technical jargon

### ✅ **Developer-Informed**
- Detailed error logs in development mode
- Technical details hidden from customers
- Console logs only in development
- Easy debugging information

### ✅ **Production-Ready**
- Graceful degradation
- Fallback values for missing data
- Validation before critical operations
- Error boundaries catch crashes

---

## 📋 **Components**

### **1. ErrorBoundary** (`/src/components/ErrorBoundary.tsx`)

**Purpose:** Catches React component crashes and prevents white screen of death.

**Usage:**
```tsx
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

**Features:**
- Catches any React rendering errors
- Shows friendly "Something went wrong" message
- Provides "Try Again" and "Go Home" buttons
- Developer details in development mode only
- Production-ready error tracking hooks

**Customer Sees:**
```
🔴 Oops! Something went wrong

We're sorry, but something unexpected happened. 
Don't worry, our team has been notified.

[Try Again] [Go Home]
```

**Developer Sees (Dev Mode Only):**
```
Same as customer, PLUS:

▼ Developer Info (Development Only)
  Error: Cannot read property 'x' of undefined
  Component Stack: ...
```

---

### **2. ErrorDisplay** (`/src/components/ErrorDisplay.tsx`)

**Purpose:** Reusable component for showing user-friendly errors in specific sections.

**Usage:**
```tsx
<ErrorDisplay
  title="Unable to Load Products"
  message="We're having trouble loading products. Please try again."
  onRetry={() => refetch()}
  technical={error}
/>
```

**Props:**
- `title` - Customer-friendly heading
- `message` - What went wrong in simple terms
- `onRetry` - Optional retry function
- `technical` - Technical error (logged in dev mode)
- `className` - Additional styling

**Example:**
```tsx
{error && (
  <ErrorDisplay
    title="Unable to Load Product"
    message={getCustomerErrorMessage(error)}
    onRetry={() => window.location.reload()}
    technical={error}
  />
)}
```

---

### **3. Data Helper Utilities** (`/src/utils/dataHelpers.ts`)

**Purpose:** Validation and safe handling of potentially missing WordPress data.

#### **formatPrice**
```typescript
formatPrice(price, fallback = "Contact for Price"): string

// Examples:
formatPrice("₹25,000") → "₹25,000"
formatPrice(null) → "Contact for Price"
formatPrice("0") → "Contact for Price"
formatPrice("", "Price on Request") → "Price on Request"
```

#### **getVariationPrice**
```typescript
getVariationPrice(variation): string

// Handles missing variation prices
// Returns "Price on Request" if price missing
variation.price || variation.salePrice || variation.regularPrice
```

#### **getVariationName**
```typescript
getVariationName(productName, variation): string

// Safely combines product name with variation attribute
"Garden Bench" + variation.color → "Garden Bench - Red"
```

#### **validateProduct**
```typescript
validateProduct(product): { isValid: boolean, errors: string[] }

// Checks product has required fields
// Returns validation result
{ isValid: true, errors: [] }
{ isValid: false, errors: ["Product name missing"] }
```

#### **logError**
```typescript
logError(context, error, additionalInfo?)

// Developer-only logging
// Production: silent or sent to tracking service
// Development: detailed console logs
```

#### **getCustomerErrorMessage**
```typescript
getCustomerErrorMessage(error): string

// Converts technical errors to friendly messages
GraphQL Error → "The item you're looking for could not be found."
Network Error → "Unable to connect. Please check your internet."
Unknown → "We're experiencing technical difficulties."
```

---

## 🎨 **Error Scenarios & Handling**

### **Scenario 1: Missing Price**

**Admin Action:** Forgot to set price for variation in WordPress

**Without Error Handling:**
```
Price: undefined
Add to Cart → Cart shows: undefined
```

**With Error Handling:**
```tsx
price: getVariationPrice(variation)
// Shows: "Price on Request"
// Customer can still browse
// Clear what to do (contact for price)
```

---

### **Scenario 2: Product Not Found**

**Customer Action:** Opens link to deleted product

**Without Error Handling:**
```
White screen / Console errors
Customer confused, leaves site
```

**With Error Handling:**
```tsx
<ErrorDisplay
  title="Unable to Load Product"
  message="The item you're looking for could not be found."
  onRetry={() => window.location.reload()}
/>
[Browse All Products]
```

**Customer Experience:**
- Clear message
- Action button to browse other products
- Professional presentation
- Not a dead end

---

### **Scenario 3: Network Error**

**Customer Action:** Poor internet connection

**Without Error Handling:**
```
Loading forever...
Console errors
Customer frustrated
```

**With Error Handling:**
```tsx
<ErrorDisplay
  title="Connection Issue"
  message="Unable to connect. Please check your internet connection."
  onRetry={() => refetch()}
/>
[Try Again]
```

---

### **Scenario 4: App Crash**

**Developer Action:** Bug in code causes React crash

**Without Error Handling:**
```
White screen of death
Customer sees nothing
No recovery
```

**With Error Handling:**
```tsx
<ErrorBoundary>
🔴 Oops! Something went wrong
[Try Again] [Go Home]

// Developer Info (Dev Only)
Error details...
Component stack...
</ErrorBoundary>
```

---

### **Scenario 5: Invalid Add to Cart**

**Admin Action:** Product missing required fields

**Without Error Handling:**
```
Add to Cart → breaks
Cart shows weird data
Bad UX
```

**With Error Handling:**
```tsx
const validation = validateProduct(product);
if (!validation.isValid) {
  notify.error('This product has incomplete information. Please contact us.');
  return;
}
```

**Customer Sees:**
- Toast: "This product has incomplete information. Please contact us."
- Not added to cart
- Clear next step

**Developer Sees (Dev Mode):**
- Console: Product validation errors
- Specific fields missing
- Easy to fix

---

## 🔧 **Implementation Examples**

### **Product Detail Page**

```tsx
// Error Display
{error && (
  <ErrorDisplay
    title="Unable to Load Product"
    message={getCustomerErrorMessage(error)}
    onRetry={() => window.location.reload()}
    technical={error}
  />
)}

// Price Handling
<p className="text-4xl">
  {formatPrice(product.price || product.regularPrice)}
</p>

// Add to Cart Validation
const handleAddToCart = () => {
  try {
    const validation = validateProduct(product);
    if (!validation.isValid) {
      logError('Product Validation', validation.errors);
      notify.error('Product has incomplete information.');
      return;
    }
    
    addToCart({
      ...
      price: formatPrice(product.price)
    });
  } catch (error) {
    logError('Add to Cart Failed', error);
    notify.error('Unable to add to cart. Please try again.');
  }
};
```

---

## 📊 **Error Logging**

### **Development Mode**
```typescript
logError('Context', error, additionalInfo);

// Console Output:
🔴 Error: Context
  Error: [error details]
  Additional Info: [data]
```

### **Production Mode**
```typescript
// Silent to customer
// Can be sent to:
// - Sentry
// - LogRocket
// - Custom error tracking
```

---

## ✅ **Benefits**

### **For Customers:**
1. ✅ **Clear Communication** - Know what's wrong
2. ✅ **Next Steps** - What to do about it
3. ✅ **Professional** - Builds trust
4. ✅ **No Technical Jargon** - Easy to understand
5. ✅ **Recoverable** - Always a way forward

### **For Developers:**
1. ✅ **Easy Debugging** - Detailed error info in dev mode
2. ✅ **Centralized** - All error handling in one place
3. ✅ **Reusable** - Components work everywhere
4. ✅ **Maintainable** - Easy to update messages
5. ✅ **Production Safe** - No leaks of technical info

### **For Business:**
1. ✅ **Better UX** - Customers don't leave on errors
2. ✅ **Professional Image** - Polished error states
3. ✅ **Error Tracking** - Know what's failing
4. ✅ **Recovery Options** - Keep customers engaged
5. ✅ **Trust Building** - Transparent but friendly

---

## 🎯 **Best Practices**

### **DO:**
✅ Use `formatPrice()` for ALL price displays  
✅ Use `validateProduct()` before critical operations  
✅ Use `ErrorDisplay` for section errors  
✅ Use `ErrorBoundary` for app-level protection  
✅ Use `logError()` instead of `console.error`  
✅ Provide retry options when possible  
✅ Test error states  

### **DON'T:**
❌ Show raw error messages to customers  
❌ Use `console.log` in production code  
❌ Let missing data crash the app  
❌ Display technical stack traces  
❌ Leave errors unhandled  
❌ Make errors dead ends  

---

## 🚀 **Production Checklist**

- [x] ErrorBoundary wraps entire app
- [x] All API calls have error handling
- [x] All prices use formatPrice()
- [x] Product validation before add to cart
- [x] Customer-friendly error messages
- [x] Developer logs only in dev mode
- [x] Retry options where applicable
- [x] Fallback values for missing data
- [x] Error tracking hooks ready
- [x] No console.logs in production

---

## 📝 **Quick Reference**

**When to use what:**

| Scenario | Use | Example |
|----------|-----|---------|
| App crashes | `ErrorBoundary` | Wrap entire app |
| API fails | `ErrorDisplay` | Product fetch error |
| Missing price | `formatPrice()` | Price display |
| Missing data | `validateProduct()` | Before add to cart |
| Need to log | `logError()` | Catch blocks |
| Show to user | `getCustomerErrorMessage()` | Error display |

---

**Error handling is now enterprise-grade! 🎉**

Customers see friendly messages. Developers get useful info. Everyone wins! ✨
