import { ApiError } from "next/dist/server/api-utils";

/**
 * One way computers can dialogate is using the HTTP protocol!
 * One of the main purpose of server-side application is Routing:
 * Understanding what a clients is asking and respond accordingly.
 */
export default function apiWrapper(options) {
  const { onRequest, controller, method } = {
    onRequest: [],
    method: "GET",
    ...options,
  };

  return async (req, res) => {
    try {
      // Checks if the methods requested is supported
      if (!isMethodAllowed(method, req.method)) {
        throw new ApiError(405, "Method not allowed");
      }

      // Executes in sequence all beforeRequest jobs to check (eg: validation and authorization)
      for (const fn of onRequest) {
        await fn(req, res);
      }

      // Executes the controller of the route
      await controller.call(options, req, res);
    } catch (error) {
      // Handles errors and format it a way that the client can use it
      process.stderr.write(`[api-error]: ${error.message}\n${error.stack}\n`);
      const statusCode = error.statusCode || 500;
      res.status(statusCode);
      return res.json({
        statusCode: statusCode,
        message: error.message,
      });
    }
  };
}

/**
 * Check if the asked method is supported by our app.
 */
const isMethodAllowed = (allowed, method) => {
  if (!Array.isArray(allowed)) allowed = [allowed];
  return allowed.includes(method);
};
