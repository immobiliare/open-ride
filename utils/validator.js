import Ajv from "ajv";
import { ApiError } from "next/dist/server/api-utils";

/**
 * Validation is an important scope of server application.
 * You can't never trust data coming from the clients
 * because a malicious actor could craft payload that can
 * create problems in various part of the whole architecture.
 * For example: Some kind of hack involves Injection of strings
 * representing database queries, if the data is not validated and
 * cleaned up, external actor could gain access to all your application data
 */

/**
 * Create a validator using a schema that describes how data should be
 */
export const validate = (schema, data, ajvOptions = {}) => {
  const ajv = new Ajv(ajvOptions);
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return {
    isValid: valid,
    errors: validate.errors
      ? validate.errors.map((e) => `${e.keyword} ${e.message}`).join(", ")
      : undefined,
  };
};

/**
 * Create a function that checks if incoming request has valid data
 */
export const validateRequest = (schema, field = "body", ajvOptions) => {
  return (req) => {
    if (!req[field]) req[field] = {};
    const validation = validate(schema, req[field], ajvOptions);
    if (!validation.isValid)
      throw new ApiError(400, `${field}: ${validation.errors}`);
  };
};
