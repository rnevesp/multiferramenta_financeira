import { createStart, createCsrfMiddleware } from "@tanstack/react-start";

// Protect server functions (n8n proxy) from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
}));
