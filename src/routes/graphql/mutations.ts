import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { CreateUserInput, UserType, ChangeUserInput } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';
import { ChangePostInput, CreatePostInput, PostInput, PostType } from './types/posts.js';
import {
  ChangeProfileInput,
  CreateProfileInput,
  ProfileInput,
  ProfileType,
} from './types/profiles.js';

const prisma = new PrismaClient();
interface UserInput {
  name: string;
  balance: number;
}

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType as GraphQLObjectType,
      description: 'Create user',
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: async (_source, args: { dto: UserInput }, _context) =>
        await prisma.user.create({ data: args.dto }),
    },
    deleteUser: {
      type: GraphQLBoolean,
      description: 'Delete user',
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_source, args: { id: string }, _context) => {
        const { id } = args;
        await prisma.user.delete({
          where: {
            id: id,
          },
        });
        return true;
      },
    },
    changeUser: {
      type: UserType as GraphQLObjectType,
      description: 'Patch user',
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeUserInput },
      },
      resolve: async (_source, args: { id: string; dto: UserInput }, _context) => {
        const { id, dto } = args;
        const user = await prisma.user.update({
          where: { id: id },
          data: dto,
        });
        if (!user) throw new Error('not found');
        return user;
      },
    },
    createPost: {
      type: PostType,
      description: 'Create post',
      args: {
        id: { type: UUIDType },
        dto: { type: CreatePostInput },
      },
      resolve: async (_source, { dto }: { dto: PostInput }, _context) =>
        await prisma.post.create({ data: dto }),
    },
    createProfile: {
      type: ProfileType as GraphQLObjectType,
      description: 'Create profile',
      args: {
        dto: { type: CreateProfileInput },
      },
      resolve: async (_source, { dto }: { dto: ProfileInput }, _context) =>
        await prisma.profile.create({ data: dto }),
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, { id }: { id: string }) => {
        await prisma.post.delete({
          where: {
            id: id,
          },
        });
        return true;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, { id }: { id: string }) => {
        await prisma.profile.delete({
          where: {
            id: id,
          },
        });
        return true;
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangePostInput },
      },
      resolve: async (_, { id, dto }: { id: string; dto: Partial<PostInput> }) =>
        await prisma.post.update({
          where: { id: id },
          data: dto,
        }),
    },
    changeProfile: {
      type: ProfileType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_, { id, dto }: { id: string; dto: Partial<ProfileInput> }) => {
        try {
          const res = await prisma.profile.update({
            where: { id: id },
            data: dto,
          });
          return res;
        } catch (e) {
          return e;
        }
      },
    },
    subscribeTo: {
      type: UserType as GraphQLObjectType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) =>
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: authorId,
              },
            },
          },
        }),
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
      },
    },
  },
});

export default Mutation;
