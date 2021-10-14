import { ApiError } from "next/dist/server/api-utils";
import apiWrapper from "utils/apiWrapper";
import { checkAuthentication } from "utils/jwt";
import { validateRequest } from "utils/validator";
import Match from "repository/Match";
import User from "repository/User";
import Track from "repository/Track";

const withUsers = (match) => {
  // simulate "join"
  match.driver = User.findOne({ id: match.driverId });
  match.user = User.findOne({ id: match.userId });
  return match;
};

export default apiWrapper({
  method: ["GET", "POST", "PUT", "DELETE"],

  // This route is for logged-in only users
  // we check here that who is doing the request is logged-in
  onRequest: [checkAuthentication],

  controller(req, res) {
    if (req.method === "GET") return this.get(req, res);
    if (req.method === "POST") return this.post(req, res);
    if (req.method === "PUT") return this.put(req, res);
    if (req.method === "DELETE") return this.delete(req, res);
  },
  get(req, res) {
    // if is driver get his passenger
    // if is user get the driver
    return res.json(
      Match.index(
        {
          driverId: req.user.id,
          userId: req.user.id,
        },
        "some" // query in $OR
      ).map(withUsers)
    );
  },
  async post(req, res) {
    req.body.userId = req.user.id;

    validateRequest(Match.schema)(req);

    // simulates unique constraints
    if (
      Match.findOne({ userId: req.body.userId, driverId: req.body.driverId })
    ) {
      throw new ApiError(
        400,
        "A Match For this user/driver pair already exists"
      );
    }

    const match = Match.store(req.body);
    if (match.status === "accepted") {
      await this.updateDriverTrack(match.driverId);
    }
    return res.json(withUsers(match));
  },

  async put(req, res) {
    const id = req?.query?.index?.[0];
    if (!id) throw new ApiError(405, "Not Allowed");
    validateRequest(Match.schema)(req);
    const match = Match.update(id, req.body);
    if (match.status === "accepted") {
      await this.updateDriverTrack(match.driverId);
    }
    return res.json(withUsers(match));
  },

  async delete(req, res) {
    const id = req?.query?.index?.[0];
    if (!id) throw new ApiError(405, "Not Allowed");
    const driverId = match.driverId;
    const match = Match.destroy(id);
    await this.updateDriverTrack(driverId);
    return res.json({ message: "deleted" });
  },

  async updateDriverTrack(driverId) {
    const driver = User.findOne({ id: driverId });

    // Upser track if doesnt exist
    let track = Track.findOne({ userId: driverId });
    if (!track) {
      const { coordinates, duration, distance } =
        await Track.calculateDirections(driver);
      track = Track.store({
        userId: driverId,
        coordinates,
        duration,
        distance,
      });
    }

    // get driver's accepted passengers coordinates
    const matches = Match.getAcceptedPassengers(driver);

    const passengersCoordinates = [];
    for (const { userId } of matches) {
      const user = User.findOne({ id: userId });
      if (!user) continue;
      const { lng, lat } = user.coordinates;
      passengersCoordinates.push([lng, lat]);
    }

    // Calculate and store driver direction with passengers
    {
      const { coordinates, duration, distance } =
        await Track.calculateDirections(driver, passengersCoordinates);
      track.coordinates = coordinates;
      track.duration = duration;
      track.distance = distance;
    }

    return Track.update(track.id, track);
  },
});
