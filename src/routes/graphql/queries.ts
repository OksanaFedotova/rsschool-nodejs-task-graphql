import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLString,
} from 'graphql';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      description: 'get all users',
      resolve: async () => await prisma.user.findMany(),
    },
    user: {
      type: UserType,
      description: 'Get user by Id',
      args: {
        id: {
          type: UUIDType,
        },
      },
      resolve: async (_source, args: { id: string }, _context) => {
        const { id } = args;
        const user = await prisma.user.findUnique({
          where: {
            id: id,
          },
        });
        if (!user) throw new Error('not found');
        return user;
      },
    },

  },
});

export default Query;
