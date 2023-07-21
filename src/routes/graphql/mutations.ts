import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLString,
} from 'graphql';
import { CreateUserInput, UserType, ChangeUserInput } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
interface UserInput {
  name: string;
  balance: number;
};

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      description: 'Create user',
      args: {
        dto: { type: CreateUserInput }
      },
      resolve: async (_source, args: { dto: UserInput }, _context) => 
        await prisma.user.create({ data: args.dto })
    },
    deleteUser: {
      type: UserType, //уточнить
      description: 'Delete user',
      args: {
        id: { type: UUIDType }, 
      },
      resolve: async (_source, args: { id: string }, _context) => {
        const { id } = args;
        const user = await prisma.user.delete({
          where: {
            id: id,
          },
        });
        if (!user) throw new Error('not found');
        return user;
      },
    },
    changeUser: {
      type: UserType,
      description: 'Patch user',
      args: {
        id: { type: UUIDType }, 
        dto: { type: ChangeUserInput}
      },
      resolve: async (_source, args: { id: string, dto: UserInput }, _context) => {
        const { id, dto } = args;
        const user = await prisma.user.update({
          where: { id: id, },
          data: dto,
        });
        if (!user) throw new Error('not found');
        return user;
      },
    }
    }
  },
);

export default Mutation;