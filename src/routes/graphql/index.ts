import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import Query from './queries.js';
import Mutation from './mutations.js';
import depthLimit from 'graphql-depth-limit';

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
      const depthErrors = validate(schema, parse(String(query)), [depthLimit(5)]);
      if (depthErrors.length) {
        return {
          errors: depthErrors,
        };
      }
      return await graphql({
        schema,
        source: String(query),
        variableValues: variables,
      });
    },
  });
};

export default plugin;
