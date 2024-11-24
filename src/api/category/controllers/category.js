"use strict";

const category = require("../routes/category");



const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::category.category",
  ({ strapi }) => ({
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
        const services = await strapi.db
          .query("api::service.service")
          .findMany({
            populate: {
              category: true, // Populate services related to the category
            },
          });

        const result = categories.map((category) => ({
          category_name: category.Category, // Assuming category_name is a field in your category schema
          services: services
            .filter((service) => service.category.id === category.id)
            .map((service) => ({
              service_name: service.NavbarTitle,
              pageUrl: service.pageUrl, // Include page URL
            })),
        }));
        ctx.send({ data: result }, 200);
      } catch (err) {
        ctx.send({ error: "An error occurred while fetching the data." }, 500);
      }
    },
  })
);
