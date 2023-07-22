import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponse, gqlResponse } from './schemas.js';
import { GraphQLFieldConfig, buildSchema, graphql } from 'graphql';
import { GraphQLSchema } from 'graphql';
import Query from './queries.js';
import Mutation from './mutations.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  //const { prisma, httpErrors } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponse,
      response: {
        200: gqlResponse,
      },
    },
    async handler({ body }) {
      const { variables, query } = body;
      const schema = new GraphQLSchema({
        query: Query,
        mutation: Mutation,
      });

      return await graphql({
        schema,
        source: String(query),
        variableValues: variables,
      });
    },
  });
};

export default plugin;
