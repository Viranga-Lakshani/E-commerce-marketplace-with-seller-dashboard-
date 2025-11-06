import { FastifyPluginAsync } from "fastify";
import prisma from "../lib/prisma";

/**
 * Orders endpoints: create order (checkout simulation), list orders.
 * Payment is stubbed for local dev. Replace with Stripe server-side flow for production.
 */

const route: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    const body = request.body as any;
    const buyerId = body.buyerId;
    const items = body.items as { productId: string; quantity: number }[];

    // Load product prices and verify inventory
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    // Compute totals and validate quantities
    let total = 0;
    const orderItemsData: any[] = [];
    for (const it of items) {
      const product = products.find((p) => p.id === it.productId);
      if (!product) return reply.code(400).send({ error: `Product ${it.productId} not found` });
      if (product.inventory < it.quantity) return reply.code(400).send({ error: `Insufficient inventory for ${product.title}` });
      total += product.priceCents * it.quantity;
      orderItemsData.push({
        product: { connect: { id: product.id } },
        quantity: it.quantity,
        unitCents: product.priceCents,
      });
    }

    // Create order and reduce inventory within a transaction
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          buyer: { connect: { id: buyerId } },
          totalCents: total,
          currency: "USD",
          status: "PAID", // In dev we mark as PAID. Replace with payment flow.
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      // Decrement inventory
      for (const it of items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { inventory: { decrement: it.quantity } },
        });
      }

      return created;
    });

    return reply.code(201).send(order);
  });

  fastify.get("/", async (request, reply) => {
    const orders = await prisma.order.findMany({ include: { items: { include: { product: true } }, buyer: true } });
    return orders;
  });
};

export default route;
