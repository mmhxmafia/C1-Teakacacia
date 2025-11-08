import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/context/AuthContext';
import { GET_CUSTOMER_INFO, GET_CUSTOMER_ORDERS } from '@/lib/orderQueries';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Package, MapPin, Settings, Loader2 } from "lucide-react";

const MyAccount = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { loading: loadingCustomer, data: customerData } = useQuery(GET_CUSTOMER_INFO, {
    skip: !isAuthenticated,
  });

  const { loading: loadingOrders, data: ordersData } = useQuery(GET_CUSTOMER_ORDERS, {
    skip: !isAuthenticated,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/account' } } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const customer = customerData?.customer;
  const orders = ordersData?.customer?.orders?.nodes || [];
  const recentOrders = orders.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-font text-4xl font-medium text-foreground mb-2">
              My Account
            </h1>
            <p className="text-muted-foreground">
              Manage your account and view your orders
            </p>
          </div>

          {loadingCustomer ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">
                  <User className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="addresses">
                  <MapPin className="h-4 w-4 mr-2" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="heading-font">Account Information</CardTitle>
                      <CardDescription>Your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">
                          {customer?.firstName} {customer?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{customer?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Username</p>
                        <p className="font-medium">{customer?.username}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="heading-font">Order Statistics</CardTitle>
                      <CardDescription>Your shopping summary</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Orders</span>
                        <span className="text-2xl font-semibold">{orders.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pending</span>
                        <span className="font-medium">
                          {orders.filter((o: any) => o.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <span className="font-medium">
                          {orders.filter((o: any) => o.status === 'completed').length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="heading-font">Recent Orders</CardTitle>
                        <CardDescription>Your latest purchases</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/orders')}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingOrders ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : recentOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No orders yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentOrders.map((order: any) => (
                          <div
                            key={order.id}
                            className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-accent cursor-pointer"
                            onClick={() => navigate(`/order/${order.databaseId}`)}
                          >
                            <div>
                              <p className="font-medium">
                                Order #{order.orderNumber || order.databaseId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(order.date)} • {order.lineItems.nodes.length} items
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{order.total}</p>
                              <Badge className={getStatusColor(order.status)} size="sm">
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-font">All Orders</CardTitle>
                    <CardDescription>
                      View complete order history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        View your complete order history
                      </p>
                      <Button onClick={() => navigate('/orders')}>
                        Go to Order History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Billing Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="heading-font">Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {customer?.billing?.address1 ? (
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">
                            {customer.billing.firstName} {customer.billing.lastName}
                          </p>
                          <p>{customer.billing.address1}</p>
                          {customer.billing.address2 && <p>{customer.billing.address2}</p>}
                          <p>
                            {customer.billing.city}, {customer.billing.state} {customer.billing.postcode}
                          </p>
                          <p>{customer.billing.country}</p>
                          <p className="pt-2">{customer.billing.phone}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No billing address saved
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Shipping Address */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="heading-font">Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {customer?.shipping?.address1 ? (
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">
                            {customer.shipping.firstName} {customer.shipping.lastName}
                          </p>
                          <p>{customer.shipping.address1}</p>
                          {customer.shipping.address2 && <p>{customer.shipping.address2}</p>}
                          <p>
                            {customer.shipping.city}, {customer.shipping.state} {customer.shipping.postcode}
                          </p>
                          <p>{customer.shipping.country}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No shipping address saved
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-font">Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-medium mb-2">Logout</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sign out of your account on this device
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
