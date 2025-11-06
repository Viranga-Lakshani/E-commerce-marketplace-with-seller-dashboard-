import { FastifyPluginAsync } from "fastify";
import prisma from "../lib/prisma";
import { z } from "zod";

/**
 * Public shop routes: list products, get product by id
 */
const route: FastifyPluginAsync = async (fastify) => {
  fastify.get("/products", async (request, reply) => {
    const q = request.query as any;
    const limit = Number(q.limit || 20);
    const cursor = q.cursor as string | undefined;

    const where = { inventory: { gt: 0 } };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    let nextCursor: string | null = null;
    if (products.length > limit) {
      const next = products.pop()!;
      nextCursor = next.id;
    }

    return { data: products, nextCursor };
  });

  fastify.get("/products/:id", async (request, reply) => {
    const { id } = request.params as any;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return reply.code(404).send({ error: "Product not found" });
    }
    return product;
  });

  // Simple demo login endpoint — in dev we create a user/seller on-the-fly.
  fastify.post("/login", async (request, reply) => {
    const body = request.body as any;
    const name = body?.name || `guest-${Math.floor(Math.random() * 10000)}`;
    // Create or find a user
    const user = await prisma.user.upsert({
      where: { email: null as unknown as string },
      update: {},
      create: { name, role: "CUSTOMER" },
    });
    // Return a JWT-like token payload (for demo we return user object)
    // In real app sign JWT; fastify-jwt is available for that.
    return { user };
  });
};

export default route;
