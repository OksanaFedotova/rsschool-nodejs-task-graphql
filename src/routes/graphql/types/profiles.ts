import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import { UUIDType } from './uuid.js';
//import { MemberTypeId } from '../../member-types/schemas.js';
import { MemberType } from './memberTypes.js';
import { UserType } from './user.js';
import { PrismaClient } from '@prisma/client';
export interface ProfileInput {
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}
const prisma = new PrismaClient();
export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  description: 'Profiles data',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async ({ memberTypeId }: { memberTypeId: string }) =>
        prisma.memberType.findUnique({ where: { id: memberTypeId } }),
    },
    user: { type: UserType as GraphQLObjectType },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  description: 'Profiles data for input',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: GraphQLString },
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  description: 'Profiles data to change',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLString },
  }),
});
