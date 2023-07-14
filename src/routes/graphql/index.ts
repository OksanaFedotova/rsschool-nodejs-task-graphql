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


const plugin: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  const { prisma, httpErrors } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
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
