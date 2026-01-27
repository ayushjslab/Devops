import { ApolloServer } from "@apollo/server";
import { schema } from "@/graphql/schema"
import { startServerAndCreateNextHandler } from "@as-integrations/next";
const server = new ApolloServer({
    schema,
})

export const handler = startServerAndCreateNextHandler(server);

export {handler as GET, handler as POST}