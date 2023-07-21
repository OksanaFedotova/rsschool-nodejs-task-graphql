/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLFloat,
} from 'graphql';
import { UUIDType } from './uuid.js';

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  description: 'Users data',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'UserInput',
  description: 'User data for input',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User name, required, no default value',
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'UserChange',
  description: 'User data to change',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'User name, not required, no default value',
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});