import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} from "graphql";

export const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "Users data",
  fields: () => ({
    name: { type: GraphQLString },
    balance: {type: GraphQLInt}
  })
})

