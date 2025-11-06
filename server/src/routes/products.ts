import { FastifyPluginAsync } from "fastify";
import prisma from "../lib/prisma";
import { z } from "zod";

/**
 * Product management endpoints for sellers.
 * This is a minimal implementation. A production system requires:
 * - proper seller authentication & authorization checks
 * - image uploads with signed URLs
 * - input validation and sanitization
 */

const createProductSchema = {
  body: {
    type: "object",
    required: ["title", "priceCents", "inventory", "sellerId"],
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      priceCents: { type: "number" },
      inventory: { type: "number" },
      imageUrl: { type: "string" },
      sellerId: { type: "string" },
    },
  },
};

const route: FastifyPluginAsync = async (fastify) => {
  // Create product (seller)
  fastify.post("/", { schema: createProductSchema }, async (request, reply) => {
    const body = request.body as any;
    const p = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        priceCents: Math.max(0, Math.floor(body.priceCents)),
        inventory: Math.max(0, Math.floor(body.inventory)),
        imageUrl: body.imageUrl,
        seller: { connect: { id: body.sellerId } },
      },
    });
    return reply.code(201).send(p);
  });

  // Update product
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as any;
    const body = request.body as any;
    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        priceCents: body.priceCents,
        inventory: body.inventory,
        imageUrl: body.imageUrl,
      },
    });
    return updated;
  });

  // Delete product
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as any;
    await prisma.product.delete({ where: { id } });
    return { success: true };
  });
};

export default route;
