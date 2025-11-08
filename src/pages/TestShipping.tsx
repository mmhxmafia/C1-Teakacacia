import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Test multiple possible shipping queries
const TEST_SHIPPING_QUERY = gql`
  query TestShipping {
    # Try to get general settings
    generalSettings {
      title
      url
    }
  }
`;

const TestShipping = () => {
  const { data, loading, error } = useQuery(TEST_SHIPPING_QUERY);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Shipping GraphQL Test</h1>

          <div className="space-y-6">
            {/* Loading State */}
            {loading && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900">Loading...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-lg font-semibold text-red-900 mb-2">GraphQL Error:</h2>
                <pre className="text-sm text-red-700 overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
            )}

            {/* Success State */}
            {data && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h2 className="text-lg font-semibold text-green-900 mb-2">GraphQL Response:</h2>
                <pre className="text-sm text-green-700 overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}

            {/* Instructions */}
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Test Shipping Queries:</h2>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">Step 1: Open GraphQL IDE</h3>
                  <p>Visit: <code className="bg-white px-2 py-1 rounded">https://admin.teakacacia.com/graphql</code></p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Step 2: Try These Queries:</h3>
                  
                  <div className="space-y-3 mt-2">
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium mb-1">Query 1: Test Shipping Classes</p>
                      <pre className="text-xs overflow-auto">{`{
  shippingClasses {
    nodes {
      name
      slug
    }
  }
}`}</pre>
                    </div>

                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium mb-1">Query 2: Test Product Shipping</p>
                      <pre className="text-xs overflow-auto">{`{
  products(first: 1) {
    nodes {
      name
      ... on SimpleProduct {
        shippingClassId
        weight
        length
        width
        height
      }
    }
  }
}`}</pre>
                    </div>

                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium mb-1">Query 3: Test Shipping Methods (if available)</p>
                      <pre className="text-xs overflow-auto">{`{
  shippingMethods {
    id
    title
  }
}`}</pre>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Step 3: Check Schema</h3>
                  <p>In GraphiQL, press <kbd className="bg-white px-2 py-1 rounded border">Ctrl+Space</kbd> to see available fields</p>
                  <p className="mt-1">Look for: shippingZones, shippingMethods, shippingClasses</p>
                </div>
              </div>
            </div>

            {/* Console Instructions */}
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">Check Browser Console</h2>
              <p className="text-sm text-yellow-700">
                Press F12 → Console tab to see detailed shipping query logs
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestShipping;
