import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const GQL_ENDPOINT = import.meta.env.VITE_GQL_ENDPOINT || 'http://localhost:4000/graphql';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: GQL_ENDPOINT,
  }),
  cache: new InMemoryCache(),
});
