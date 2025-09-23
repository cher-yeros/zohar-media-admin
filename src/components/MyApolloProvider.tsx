import { useAppSelector } from "@/redux/hooks";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { useMemo, ReactNode } from "react";

interface MyApolloProviderProps {
  children: ReactNode;
}

export default function MyApolloProvider({ children }: MyApolloProviderProps) {
  const { token } = useAppSelector((state) => state.auth);

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
