import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Checks if the session is valid or expired.
 * @returns {Object|null} - Returns the session token and creation time if valid, otherwise null.
 */
const getSessionData = () => {
  if (typeof window === 'undefined') return null; // Use window instead of process.browser
  const sessionData = JSON.parse(localStorage.getItem('woo-session'));
  if (sessionData && sessionData.token && sessionData.createdTime) {
    // Check if the token is older than 7 days
    if (Date.now() - sessionData.createdTime > SEVEN_DAYS) {
      // Token is expired
      localStorage.removeItem('woo-session');
      localStorage.setItem('woocommerce-cart', JSON.stringify({}));
      return null;
    }
    return sessionData;
  }
  return null;
};

/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
  const sessionData = getSessionData();
  if (sessionData) {
    const { token } = sessionData;
    operation.setContext(() => ({
      headers: {
        'woocommerce-session': `Session ${token}`,
      },
    }));
  }

  return forward(operation);
});

/**
 * Stores the WooCommerce session token in localStorage.
 * @param {Headers} headers - The headers object from the server response.
 */
const storeSessionData = (headers) => {
  const session = headers.get('woocommerce-session');
  if (session && typeof window !== 'undefined') {
    if ('false' === session) {
      // Remove session data if session destroyed.
      localStorage.removeItem('woo-session');
    } else if (!localStorage.getItem('woo-session')) {
      // Update session new data if changed.
      localStorage.setItem(
        'woo-session',
        JSON.stringify({ token: session, createdTime: Date.now() }),
      );
    }
  }
};

/**
 * Afterware operation.
 * This catches the incoming session token and stores it in localStorage, for future GraphQL requests.
 */
export const afterware = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const { response: { headers } } = operation.getContext();
    if (headers) {
      storeSessionData(headers);
    }
    return response;
  })
);

const isServer = typeof window === 'undefined';

// Apollo GraphQL client.
const client = new ApolloClient({
  ssrMode: isServer, // Whether we are in SSR mode or client-side
  link: ApolloLink.from([
    middleware,
    afterware,
    createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, // GraphQL API URL from environment variable
      fetch, // Use native fetch
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
