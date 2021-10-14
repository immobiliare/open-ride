import { ApiError } from "next/dist/server/api-utils";

import { encode } from "utils/jwt";
import User from "repository/User";
import apiWrapper from "utils/apiWrapper";
import { validateRequest } from "utils/validator";
import { setAccessTokenCookie } from "utils/cookies";

export default apiWrapper({
  // accepts POST http requests
  method: "POST",

  onRequest: [
    // Checks that incoming requests contains user and password fields
    validateRequest({
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string" },
      },
      required: ["username", "password"],
      additionalProperties: false,
    }),
  ],

  /**
   * Checks that the user/password is correct, if not return an error
   * if it's ok set a cookie with the authentication token so the user
   * remains logged-in when reopening the app.
   * Returns the user object to the client so we can render the profile.
   */
  controller: async function (req, res) {
    const user = User.auth(req.body);
    if (!user) throw new ApiError(401, "Unauthorized");
    setAccessTokenCookie(req, res, await encode({ id: user.id }));
    return res.json(user);
  },
});
