import { CheckCircle2, XCircle, AlertTriangle, Info, Sparkles } from "lucide-react";

export interface NotificationOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const notificationIcons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  default: Sparkles,
};

export const notificationStyles = {
  success: {
    variant: "success" as const,
    icon: CheckCircle2,
    iconColor: "text-green-600 dark:text-green-400",
  },
  error: {
    variant: "error" as const,
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
  },
  warning: {
    variant: "warning" as const,
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  info: {
    variant: "info" as const,
    icon: Info,
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  default: {
    variant: "default" as const,
    icon: Sparkles,
    iconColor: "text-primary",
  },
};

// Helper function to get notification style
export const getNotificationStyle = (type: keyof typeof notificationStyles) => {
  return notificationStyles[type];
};

// Common notification messages
export const notificationMessages = {
  // Cart & Products
  addedToCart: (productName: string) => ({
    title: "Added to Cart",
    description: `${productName} has been added to your cart.`,
  }),
  removedFromCart: (productName: string) => ({
    title: "Removed from Cart",
    description: `${productName} has been removed from your cart.`,
  }),
  cartCleared: {
    title: "Cart Cleared",
    description: "All items have been removed from your cart.",
  },

  // Orders
  orderPlaced: (orderNumber: string) => ({
    title: "Order Placed Successfully!",
    description: `Your order #${orderNumber} has been placed. We'll send you a confirmation email shortly.`,
  }),
  orderFailed: {
    title: "Order Failed",
    description: "We couldn't process your order. Please try again.",
  },

  // Auth
  loginSuccess: (name?: string) => ({
    title: "Welcome Back!",
    description: name ? `Good to see you, ${name}!` : "You have successfully logged in.",
  }),
  logoutSuccess: {
    title: "Logged Out",
    description: "You have been successfully logged out.",
  },
  loginFailed: {
    title: "Login Failed",
    description: "Invalid credentials. Please try again.",
  },
  registerSuccess: {
    title: "Account Created!",
    description: "Welcome to Teakacacia! You can now start shopping.",
  },
  registerFailed: {
    title: "Registration Failed",
    description: "We couldn't create your account. Please try again.",
  },

  // Forms
  formSuccess: {
    title: "Success!",
    description: "Your information has been saved.",
  },
  formError: {
    title: "Error",
    description: "Please check your information and try again.",
  },

  // Network
  networkError: {
    title: "Connection Error",
    description: "Please check your internet connection and try again.",
  },
  loadingError: {
    title: "Loading Failed",
    description: "We couldn't load the data. Please refresh the page.",
  },

  // Generic
  success: (message: string) => ({
    title: "Success",
    description: message,
  }),
  error: (message: string) => ({
    title: "Error",
    description: message,
  }),
  warning: (message: string) => ({
    title: "Warning",
    description: message,
  }),
  info: (message: string) => ({
    title: "Info",
    description: message,
  }),
};
