/**
 * SHIPPING CONFIGURATION
 * 
 * Edit this file to change shipping information displayed on product pages.
 * This matches what you configure in WooCommerce → Settings → Shipping
 * 
 * After editing, the changes will appear automatically on frontend!
 */

export interface ShippingMethod {
  enabled: boolean;
  title: string;
  description: string;
  type: 'free' | 'flat_rate' | 'local_pickup' | 'other';
  cost?: string; // e.g., "100" for ₹100
  minAmount?: string; // e.g., "500" for free shipping over ₹500
  zoneName?: string; // e.g., "India", "Delhi", etc.
}

export const SHIPPING_CONFIG: ShippingMethod[] = [
  // FREE SHIPPING - Enable this if you offer free shipping
  {
    enabled: true, // Set to false to hide
    type: 'free',
    title: 'Free Shipping',
    description: 'On orders over ₹500',
    minAmount: '500', // Change this to your minimum amount
    zoneName: 'India', // Change to your zone name
  },

  // FLAT RATE SHIPPING - Enable this if you charge flat rate
  {
    enabled: true, // Set to false to hide
    type: 'flat_rate',
    title: 'Standard Shipping',
    description: 'Flat rate delivery',
    cost: '100', // Change this to your flat rate cost (₹100)
    zoneName: 'India', // Change to your zone name
  },

  // LOCAL PICKUP - Enable this if you offer pickup
  {
    enabled: false, // Set to true to show
    type: 'local_pickup',
    title: 'Local Pickup',
    description: 'Pickup from our store',
    cost: '0', // Free pickup
    zoneName: 'Delhi', // Your pickup location
  },

  // CUSTOM SHIPPING - Add more as needed
  {
    enabled: false, // Set to true to show
    type: 'other',
    title: 'Express Delivery',
    description: 'Delivered within 24 hours',
    cost: '200',
    zoneName: 'Delhi NCR',
  },
];

/**
 * HOW TO USE:
 * 
 * 1. Edit the values above to match your WooCommerce shipping settings
 * 2. Set enabled: true to show a method, false to hide it
 * 3. Change cost, minAmount, zoneName to match your settings
 * 4. Save this file
 * 5. Frontend updates automatically!
 * 
 * EXAMPLES:
 * 
 * Free shipping over ₹500:
 *   enabled: true
 *   type: 'free'
 *   minAmount: '500'
 * 
 * Flat rate ₹100:
 *   enabled: true
 *   type: 'flat_rate'
 *   cost: '100'
 * 
 * Free shipping (no minimum):
 *   enabled: true
 *   type: 'free'
 *   minAmount: undefined (or remove the line)
 */

// General shipping message - shown at bottom
export const SHIPPING_FOOTER_MESSAGE = 
  'Final shipping cost calculated at checkout based on your delivery address';

// Show/hide the shipping section entirely
export const SHOW_SHIPPING_INFO = true; // Set to false to hide shipping section
