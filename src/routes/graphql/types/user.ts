import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PostType } from './posts.js';
import { ProfileType } from './profiles.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  description: 'Users data',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType as GraphQLObjectType,
      resolve: async ({ id }: { id: string }) =>
        await prisma.profile.findUnique({ where: { userId: id } }),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }: { id: string }) =>
        prisma.post.findMany({ where: { authorId: id } }),
    },
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
