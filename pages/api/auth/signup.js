import User from "repository/User";
import Track from "repository/Track";
import { encode } from "utils/jwt";
import apiWrapper from "utils/apiWrapper";
import { validate, validateRequest } from "utils/validator";
import { setAccessTokenCookie } from "utils/cookies";
import { ApiError } from "next/dist/server/api-utils";

export default apiWrapper({
  // accepts POST http requests
  method: "POST",

  // Presentation: Validation checks the input data before saving to the database
  onRequest: [validateRequest(User.schema, "body", { useDefaults: true })],

  /**
   * Presentation: The router understands the request and call the
   * right function to respond to the user!
   */
  controller: async function (req, res) {
    // Presentation: We create the user in the database, we can see in the JSON.
    const user = User.store(req.body);

    // If the user is a driver we pre-calculate its home/school route
    if (user.userType === "driver") {
      try {
        // calculate home/school route
        const { coordinates, duration, distance } =
          await Track.calculateDirections(user);
        const track = {
          userId: user.id,
          coordinates,
          duration,
          distance,
        };
        const validation = validate(Track.schema, track);
        if (!validation.isValid) {
          throw new ApiError(400, validation.errors);
        }
        // Save the route in the database for later use
        Track.store(track);
      } catch {
        // if there is an error we rollback the operation to let the user try again
        User.destroy(user.id);
        throw new ApiError(500, "Error fetching direction info, retry");
      }
    }

    // After creating the user we return the user data and set a cookie with
    // the authentication so the client can authenticate the user already
    setAccessTokenCookie(req, res, await encode({ id: user.id }));
    return res.send({
      message: "user created",
      data: user,
    });
  },
});
