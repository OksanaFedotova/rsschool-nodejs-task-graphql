import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponse, gqlResponse } from './schemas.js';
import { GraphQLFieldConfig, buildSchema, graphql } from "graphql";
import { UserType } from './types/user.js';
import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} from "graphql";
import { UUIDType } from './types/uuid.js';


const plugin: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  const { prisma, httpErrors } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponse,
      response: {
        200: gqlResponse,
      },
    },
    async handler(req) {
      const Query = new GraphQLObjectType({
        name: 'Query',
        fields: {
            users: {
            type: new GraphQLList(UserType),
            description: 'All users',
            resolve:  async () => await prisma.user.findMany(),
          },
           user: {
            type: UserType,
            description: 'User by Id',
            args: {
              id: {
                type: UUIDType,
              },
            },
            resolve: async (_source, args: {id: string}, _context) => {
              const { id } = args;
              const user = await prisma.user.findUnique({ where: {
                id: id,
              },
            });
              if (!user) throw httpErrors.notFound();
              return user;
            },
          },
        },
      })
      const schema = new GraphQLSchema({
        query: Query,
      });

      return await graphql({
        schema,
        source: String(req.body.query),
        variableValues: {},
        //contextValue: prepareSomehowContext(),
      });
    },
  });
};

export default plugin;
