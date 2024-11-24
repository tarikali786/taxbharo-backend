"use strict";

const category = require("../routes/category");
const { sanitizeEntity } = require("@strapi/utils");
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

    async search(ctx) {
      const { query } = ctx.request.query;

      if (!query) {
        return ctx.badRequest("Query parameter is missing");
      }

      try {
        // Search Blogs
        const blogs = await strapi.db.query("api::blog.blog").findMany({
          where: {
            $or: [
              { title: { $containsi: query } },
              { description: { $containsi: query } },
            ],
          },
          populate: ["category", "services", "services.faqs", "image"],
        });

        // Search Services
        const services = await strapi.db
          .query("api::service.service")
          .findMany({
            where: {
              $or: [
                { service_name: { $containsi: query } },
                { details: { $containsi: query } },
                { service_heading_1: { $containsi: query } },
                { service_description_1: { $containsi: query } },
              ],
            },
            populate: ["category", "faqs", "photo"],
          });

        // Combine Results
        const results = {
          blogs,
          services,
        };

        ctx.send(results);
      } catch (error) {
        console.error("Search error:", error);
        ctx.internalServerError(
          "An error occurred while performing the search"
        );
      }
    },
  })
);
