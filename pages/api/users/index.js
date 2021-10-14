import { ApiError } from "next/dist/server/api-utils";
import apiWrapper from "utils/apiWrapper";
import { checkAuthentication } from "utils/jwt";
import User from "repository/User";
import Track from "repository/Track";

export default apiWrapper({
  method: "GET",
  onRequest: [checkAuthentication],
  async controller(req, res) {
    // Presentation: getAllDriversPassingByMyHome
    if (req.query.userType === "driver") {
      return this.getDriversPassingByMyHome(req, res);
    }

    return res.json(User.index(req.query));
  },

  getDriversPassingByMyHome(req, res) {
    // get all drivers passing near me
    const driversNearMe = Track.findTrackNearMe(req.user).map((track) => {
      // right-join drivers information
      return User.findOne({ id: track.userId });
    });
    return res.json(driversNearMe);
  },
});
