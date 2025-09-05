import { useAppSelector } from "@/redux/hooks";
import { setApolloClient } from "@/redux/slices/authSlice";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { useEffect, useMemo, useRef } from "react";
import { Outlet } from "react-router-dom";

export default function MyApolloProvider() {
  const { token } = useAppSelector((state) => state.auth);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apolloClientRef = useRef<ApolloClient<any> | null>(null);

  const apolloClient = useMemo(() => {
    const httpLink = createHttpLink({
      uri: "http://localhost:4000/graphql",
      credentials: "include",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });

    return new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),

      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
        },
      },
      connectToDevTools: true,
    });
  }, [token]);

  // Set Apollo client in authSlice
  useEffect(() => {
    if (!apolloClientRef.current) {
      setApolloClient(apolloClient);
      apolloClientRef.current = apolloClient;
    }
  }, [apolloClient]);

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
  return (
    <ApolloProvider client={apolloClient}>
      <Outlet />
    </ApolloProvider>
  );
}
