import { checkAuthentication } from "utils/jwt";
import apiWrapper from "utils/apiWrapper";
import User from "repository/User";
import { ApiError } from "next/dist/server/api-utils";

export default apiWrapper({
  // accepts POST OR PUT http requests
  method: ["GET", "PUT"],
  onRequest: [checkAuthentication],

  // The controller check the type of request and dispatch it to the correct handler
  async controller(req, res) {
    if (req.method === "GET") return this.get(req, res);
    if (req.method === "PUT") return this.put(req, res);
  },

  /**
   * Ask the DB for the user requested
   */
  get(req, res) {
    const user = User.show(req.user?.id);
    if (!user) throw new ApiError(404, "Not Found");
    return res.json(user);
  },

  /**
   * Updates the user in the DB
   */
  put(req, res) {
    const user = User.update(req.user?.id, req.body);
    return res.json(user);
  },
});
