import fp from "fastify-plugin";
import fastifyJwt from "fastify-jwt";
import { FastifyInstance } from "fastify";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

/**
 * Registers fastify-jwt and a decorator to extract current user from token.
 * For demo purposes token payload contains { id, name, role }.
 * Replace with a proper auth/user lookup in production.
 */
export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyJwt, { secret: JWT_SECRET });

  fastify.decorate("authenticate", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
});
