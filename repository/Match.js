import BaseRepository from "./BaseRepository";

/**
 * This class uses methods exposed by the BaseRepository to create
 * a "bridge" collection of natches between passengers and drivers.
 *
 * For example: Each time a passenger choose a driver a Match in idles status is created in db
 * having information about both passengers/driver IDs.
 *
 */
class Match extends BaseRepository {
  get schema() {
    return {
      type: "object",
      properties: {
        userId: { type: "string" },
        driverId: { type: "string" },
        status: {
          type: "string",
          enum: ["idle", "accepted", "rejected"],
          default: "idle",
        },
      },
      required: ["userId", "driverId"],
      additionalProperties: false,
    };
  }

  /**
   * This helper function query the DB to get all the
   * accepted matches by the provided drivers
   */
  getAcceptedPassengers(driverObj) {
    return this.index({
      driverId: driverObj.id,
      status: "accepted",
    });
  }
}

const matches = new Match("match");
export default matches;
