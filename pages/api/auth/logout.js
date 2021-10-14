import apiWrapper from "utils/apiWrapper";
import { setAccessTokenCookie } from "utils/cookies";

export default apiWrapper({
  // accepts GET http requests
  method: "GET",

  // Removes the token in the client so the user is no more logged in
  async controller(req, res) {
    setAccessTokenCookie(req, res, null);
    return res.json({});
  },
});
