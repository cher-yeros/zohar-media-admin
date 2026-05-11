import { store } from "@/redux/store";
import { config } from "@/lib/config";
import { logoutUser } from "@/redux/slices/authSlice";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useMemo, ReactNode } from "react";

interface MyApolloProviderProps {
  children: ReactNode;
}

export default function MyApolloProvider({ children }: MyApolloProviderProps) {
  const apolloClient = useMemo(() => {
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      const unauthenticated =
        graphQLErrors?.some((e) => e.extensions?.code === "UNAUTHENTICATED") ??
        false;

      if (unauthenticated) {
        localStorage.removeItem(config.tokenKey);
        localStorage.removeItem(config.userKey);
        store.dispatch(logoutUser());
      }

      // Optional: in dev, you might want to log network errors
      if (import.meta.env.DEV && networkError) {
        console.warn("GraphQL network error:", networkError);
      }
    });

    const authLink = setContext((_, prevContext: { headers?: unknown }) => {
      const headers =
        (prevContext.headers as Record<string, string> | undefined) ?? {};
      const token = store.getState().auth.token;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    const httpLink = createHttpLink({
      uri: String(config.graphqlEndpoint),
      credentials: "include",
    });

    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),

      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
        },
      },
      connectToDevTools: Boolean(import.meta.env.DEV),
    });
  }, []);

  //   const wsLink = new GraphQLWsLink(
  //     createClient({
  //       url: "ws://localhost:4000/graphql",
  //       connectionParams: {
  //         authorization: token ? `Bearer ${token}` : "",
  //       },
  //     })
  //   );

  //   const splitLink = split(
  //     ({ query }: { query: DocumentNode }) => {
  //       const definition = getMainDefinition(query);
  //       return (
  //         definition.kind === "OperationDefinition" &&
  //         definition.operation === OperationTypeNode.SUBSCRIPTION
  //       );
  //     },
  //     wsLink,
  //     httpLink
  //   );

  //   apolloClient.setLink(splitLink);
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
