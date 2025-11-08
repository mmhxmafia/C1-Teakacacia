import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppWidget from "./components/WhatsAppWidget";
import ErrorBoundary from "./components/ErrorBoundary";
import SplashScreen from "./components/SplashScreen";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrderHistory from "./pages/OrderHistory";
import MyAccount from "./pages/MyAccount";
import TestConnection from "./pages/TestConnection";
import TestShipping from "./pages/TestShipping";
import CategoryPage from "./pages/CategoryPage";
import Categories from "./pages/Categories";
import Shop from "./pages/Shop";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import client from "./lib/apolloClient";

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
            <SplashScreen />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <WhatsAppWidget />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Shop />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/test" element={<TestConnection />} />
            <Route path="/test-shipping" element={<TestShipping />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
    </AuthProvider>
  </ApolloProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
