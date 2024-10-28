"use strict";

/**
 * category controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::category.category",
  ({ strapi }) => ({
    // Extending the core controller with a custom method
    async getCategoriesWithServices(ctx) {
      try {
        // Fetch all categories with their services
        const categories = await strapi.db
          .query("api::category.category")
          .findMany({
            populate: {
              services: true, // Populate services related to the category
            },
          });

        // Construct the response with only category names and service names
        const result = categories.map((category) => ({
          category: category.Category,
          services: category.services.map((service) => ({
            service_name: service.service_name,
            pageUrl: service.pageUrl, // Include page URL
          })),
        }));

        // Send the response
        ctx.send(result);
      } catch (err) {
        ctx.send({ error: "An error occurred while fetching the data." }, 500);
      }
    },
  })
);
