import { FastifyPluginAsync } from "fastify";
import prisma from "../lib/prisma";

/**
 * Seller endpoints:
 * - create seller profile (associate to a user)
 * - get seller by id
 * - list seller products & orders
 */

const route: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    const body = request.body as any;
    // In a real app validate user permissions; here we accept userId
    const seller = await prisma.seller.create({
      data: {
        shopName: body.shopName || `${body.name}'s shop`,
        user: { connect: { id: body.userId } },
      },
      include: { user: true },
    });
    return reply.code(201).send(seller);
  });

  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as any;
    const seller = await prisma.seller.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!seller) return reply.code(404).send({ error: "Not found" });
    return seller;
  });

  fastify.get("/:id/orders", async (request, reply) => {
    const { id } = request.params as any;
    // List orders which contain products from this seller
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { sellerId: id },
          },
        },
      },
      include: { items: { include: { product: true } }, buyer: true },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  });
};

export default route;