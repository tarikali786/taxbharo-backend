module.exports = {
  routes: [
    {
      method: "GET",
      path: "/categories-with-services",
      handler: "category.getCategoriesWithServices",
      config: {
        auth:false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
