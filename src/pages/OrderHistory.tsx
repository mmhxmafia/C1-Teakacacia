import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/context/AuthContext';
import { GET_CUSTOMER_ORDERS } from '@/lib/orderQueries';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign, Loader2 } from "lucide-react";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { loading, error, data } = useQuery(GET_CUSTOMER_ORDERS, {
    skip: !isAuthenticated,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/orders' } } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const orders = data?.customer?.orders?.nodes || [];

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'on-hold': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800',
      'failed': 'bg-red-100 text-red-800',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="heading-font text-4xl font-medium text-foreground mb-2">
              Order History
            </h1>
            <p className="text-muted-foreground">
              View and track all your orders
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive">
                  Error loading orders: {error.message}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">
                  No Orders Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to see your orders here
                </p>
                <Button onClick={() => navigate('/')}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="heading-font text-xl">
                          Order #{order.orderNumber || order.databaseId}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {order.total}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.lineItems.nodes.map((item: any, index: number) => (
                        <div key={index} className="flex gap-4">
                          {item.product?.node?.image?.sourceUrl && (
                            <img
                              src={item.product.node.image.sourceUrl}
                              alt={item.product.node.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              {item.product?.node?.name || 'Product'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity} × {item.total}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/order/${order.databaseId}`)}
                      >
                        View Details
                      </Button>
                      {order.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement reorder functionality
                            console.log('Reorder:', order.id);
                          }}
                        >
                          Reorder
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistory;
