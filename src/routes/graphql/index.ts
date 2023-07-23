import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import Query from './queries.js';
import Mutation from './mutations.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
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
