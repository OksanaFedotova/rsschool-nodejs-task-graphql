import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';
import { MemberType, MemberTypeId } from './types/memberTypes.js';
import { PostType } from './types/posts.js';
import { ProfileType } from './types/profiles.js';

const prisma = new PrismaClient();
const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async () => prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeId } },
      resolve: async (_, { id }: { id: string }) => {
        try {
          const memberType = await prisma.memberType.findUnique({
            where: {
              id,
            },
          });
          return memberType;
        } catch {
          return null;
        }
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async () => prisma.post.findMany(),
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }) => {
        try {
          const post = await prisma.post.findUnique({
            where: {
              id,
            },
          });
          return post;
        } catch {
          return null;
        }
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => prisma.user.findMany(),
    },
    user: {
      type: UserType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }) => {
        const user = await prisma.user.findUnique({
          where: {
            id,
          },
        });
        return user;
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async () => prisma.profile.findMany(),
    },
    profile: {
      type: ProfileType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }: { id: string }) => {
        const profile = await prisma.profile.findUnique({
          where: {
            id,
          },
        });
        return profile;
      },
    },
  },
});

export default Query;
