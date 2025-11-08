import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const GET_PRODUCTS_TEST = gql`
  query GetProductsTest {
    products(first: 10) {
      nodes {
        id
        name
        slug
        ... on SimpleProduct {
          price
        }
      }
    }
  }
`;

const TestConnection = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS_TEST);
  const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;
  const products = data?.products?.nodes || [];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-font text-4xl mb-4">WordPress Connection Test</h1>
          
          <Card className="mb-6">
            <CardHeader><CardTitle>GraphQL Endpoint</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded font-mono text-sm break-all">
                {graphqlEndpoint || 'NOT SET'}
              </div>
              {graphqlEndpoint ? (
                <div className="flex items-center gap-2 mt-3 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Endpoint configured</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-3 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span>NOT configured</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader><CardTitle>Products Test</CardTitle></CardHeader>
            <CardContent>
              {loading && <div className="text-blue-600">Loading...</div>}
              {error && (
                <div>
                  <div className="flex items-center gap-2 text-red-600 mb-3">
                    <XCircle className="h-5 w-5" />
                    <span className="font-semibold">Error</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-sm text-red-800">{error.message}</p>
                  </div>
                </div>
              )}
              {!loading && !error && (
                <div>
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle className="h-5 w-5" />
                    <span>Connected! Found {products.length} products</span>
                  </div>
                  {products.length > 0 ? (
                    <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(products, null, 2)}
                    </pre>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                      <p className="text-sm">Connection works but no products in WooCommerce yet.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Instructions</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-semibold">If you see products above:</p>
              <p>✅ Your connection is working! Products just need to be added to homepage query.</p>
              <p className="font-semibold mt-4">If you see errors:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Check .env.local has VITE_GRAPHQL_ENDPOINT</li>
                <li>Install WPGraphQL plugin in WordPress</li>
                <li>Install WPGraphQL for WooCommerce plugin</li>
                <li>Configure CORS in WordPress</li>
              </ol>
              <Button onClick={() => window.location.reload()} className="w-full mt-4">
                Refresh Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestConnection;
