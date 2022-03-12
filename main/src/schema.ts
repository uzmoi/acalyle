import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

export const graphQLSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Root",
        fields: {
            data: {
                type: GraphQLString,
                resolve() {
                    return "Hello world";
                },
            },
        },
    }),
});
