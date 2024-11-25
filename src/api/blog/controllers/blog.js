"use strict";

/**
 * blog controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::blog.blog", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const service = await strapi.db.query("api::blog.blog").findOne({
      where: { url: id },
      populate: ["image"],
    });
    if (!service) {
      return ctx.notFound("Blog not found");
    }
    const sanitizedEntity = await this.sanitizeOutput(service, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
