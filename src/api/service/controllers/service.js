"use strict";

/**
 * service controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::service.service", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const service = await strapi.db.query("api::service.service").findOne({
      where: { pageUrl: id },
      populate: ["photo"],
    });
    if (!service) {
      return ctx.notFound("Service not found");
    }
    const sanitizedEntity = await this.sanitizeOutput(service, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
