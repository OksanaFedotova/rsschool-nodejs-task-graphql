import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} from "graphql";
import { UUIDType } from "./uuid.js";

export const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "Users data",
  fields: () => ({
    id: {type: UUIDType},
    name: { type: GraphQLString },
    balance: {type: GraphQLInt}
  })
})
