import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponse, gqlResponse } from './schemas.js';
import { GraphQLFieldConfig, buildSchema, graphql } from "graphql";
import { UserType } from './types/user.js';
import { GraphQLSchema } from "graphql";
import Query  from './queries.js';
import Mutation  from './mutations.js';


const plugin: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  //const { prisma, httpErrors } = fastify;
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

      const schema = new GraphQLSchema({
        query: Query, 
        mutation: Mutation
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
