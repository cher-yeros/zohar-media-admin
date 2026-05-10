import { store } from "@/redux/store";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useMemo, ReactNode } from "react";

interface MyApolloProviderProps {
  children: ReactNode;
}

export default function MyApolloProvider({ children }: MyApolloProviderProps) {
  const apolloClient = useMemo(() => {
    const authLink = setContext((_, { headers }) => {
      const token = store.getState().auth.token;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    const httpLink = createHttpLink({
      uri: import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:4000/graphql",
      credentials: "include",
    });

    return new ApolloClient({
      link: from([authLink, httpLink]),
      cache: new InMemoryCache(),

      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
        },
      },
      connectToDevTools: true,
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
