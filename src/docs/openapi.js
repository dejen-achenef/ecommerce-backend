export const openapi = {
  openapi: "3.0.0",
  info: { title: "Ecommerce API", version: "1.0.0" },
  servers: [{ url: "/api" }],
  paths: {
    "/auth/register": { post: { summary: "Register", responses: { "201": { description: "Created" } } } },
    "/auth/login": { post: { summary: "Login", responses: { "200": { description: "OK" } } } },
    "/categories": { get: { summary: "List categories", responses: { "200": { description: "OK" } } } },
    "/products": { get: { summary: "List products", responses: { "200": { description: "OK" } } } },
  },
};
