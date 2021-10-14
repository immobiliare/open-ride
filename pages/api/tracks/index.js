import apiWrapper from "utils/apiWrapper";
import { checkAuthentication } from "utils/jwt";
import Track from "repository/Track";
import Match from "repository/Match";
import User from "repository/User";
import { ApiError } from "next/dist/server/api-utils";

export default apiWrapper({
  method: "GET",
  onRequest: [checkAuthentication],

  async controller(req, res) {
    // preview new direction when selecting possible passenger(s)
    if (req.query.passengersIds) {
      return this.preview(req, res);
    }

    // Defaults on fetching current user track
    const track = Track.index({ userId: req.user.id });
    if (!track) throw new ApiError(404);
    return res.json(track);
  },

  /**
   * Generate a preview route given:
   * - New possible passengers from the client;
   * - Already matched passengers.
   * The merged list contains unique passengers (users) by ID
   */
  async preview(req, res) {
    // get requested users to preview and create a unique list
    const uniqueIds = new Set(req.query.passengersIds.split(","));

    // get already matched users for current driver
    const matches = Match.getAcceptedPassengers(req.user);

    // add already matched user to the unique list
    matches.map((p) => uniqueIds.add(p.userId));

    // Generate the list of id of unique users.
    const passengersIds = Array.from(uniqueIds);

    // if the list is empty return error to client
    if (!passengersIds.length) {
      throw new ApiError(400, "MissingUsersIds");
    }

    // for each id get user data from the database
    // then save the user pick-up coordinates
    let passengersCoordinates = [];
    for (const id of passengersIds) {
      const user = User.findOne({ id });
      if (user?.coordinates)
        passengersCoordinates.push([
          user.coordinates.lng,
          user.coordinates.lat,
        ]);
    }

    // if we didn't find coordinates send error to client
    if (!passengersCoordinates.length) {
      throw new ApiError(404, "UsersProvidedNotFound");
    }

    // Calculate drivers route using his home/school position and addings the coordinates
    // of each users to pick-up
    const { coordinates, duration, distance } = await Track.calculateDirections(
      req.user,
      passengersCoordinates
    );

    // creates the object to send back to the client
    const trackPreview = {
      userId: req.user.id,
      coordinates,
      duration,
      distance,
    };
    return res.json([trackPreview]);
  },
});
