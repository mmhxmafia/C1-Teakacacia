import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const graphqlUri = import.meta.env.VITE_GRAPHQL_ENDPOINT;

if (!graphqlUri) {
  throw new Error(
    'VITE_GRAPHQL_ENDPOINT is not defined. Please check your .env.local file.'
  );
}

// Auth middleware to add token to requests
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('authToken');
  
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: graphqlUri })),
  cache: new InMemoryCache(),
});

export default client;
