import { ApiError } from "next/dist/server/api-utils";
import BaseRepository from "./BaseRepository";
import { getDirections } from "utils/openRouteClient";
import { lineString, nearestPointOnLine, point } from "@turf/turf";
import getSchoolCoordinates from "utils/schoolCoordinates";

/**
 * This class uses methods exposed by the BaseRepository to save
 * the computed route of each driver, this changes over time as the driver
 * accepts/remove passengers.
 *
 * Saving results of computations in DBs allows us to avoid complex computations and/or doing too much
 * network requests to external api that may be slow or unreachable.
 * This is called caching and is used to make end-user experience consistent and faster.
 *
 */
class Track extends BaseRepository {
  get schema() {
    return {
      type: "object",
      properties: {
        userId: { type: "string" },
        duration: { type: "number" },
        distance: { type: "number" },
        coordinates: {
          type: "array",
          items: {
            type: "array",
            items: {
              type: "number",
            },
          },
        },
      },
      required: ["userId", "coordinates"],
      additionalProperties: false,
    };
  }

  /**
   * This funcions is the core of the main feature:
   * Calls the opensource service OpenRoute to calculate
   * the driver route from Home to School, if provided
   * is consider all the stops to be done to pick-up passengers!
   */
  async calculateDirections(driverUser, stops = []) {
    // if no driverUser provided inform the client to retry.
    if (!driverUser) {
      throw new ApiError(400, "DriverUserNotProvided");
    }

    // get the school coordiantes [longintude, latitude]
    const [schoolLng, schoolLat] = getSchoolCoordinates();

    // create a list of all the pair of coorirnates [longintude, latitude]
    // Starting from driver Home -> adds the users (if any) -> School
    const points = [
      [driverUser.coordinates.lng, driverUser.coordinates.lat],
      ...stops,
      [schoolLng, schoolLat],
    ];

    // perform a network call to an external service providing all the information
    // they need to make the computation.
    const geoJson = await getDirections(points);

    // Uses the response of the external service to get all
    // the coordinates needed by the client to "draw" on the
    // map the driver's route. We also get duration/distance for the UI
    const data = geoJson?.features?.[0];
    return {
      coordinates: data?.geometry?.coordinates,
      duration: data?.properties?.summary?.duration || null,
      distance: data?.properties?.summary?.distance || null,
    };
  }

  /**
   * Given an input passenger search of all the drivers
   * passing-by the passenger home.
   */
  findTrackNearMe(currentUser) {
    // get all drivers-tracks
    const allTracks = this.index({});
    // inizialize the output as empty list
    const outTracks = [];

    // Loops all drivers tracks
    for (const track of allTracks) {
      const { lng, lat } = currentUser.coordinates;

      // Create lines representing the drivers route
      const ln = lineString(track.coordinates);

      // finds the nearest point between the user and the driver route
      const nearestPoint = nearestPointOnLine(ln, point([lng, lat]), {
        units: "meters",
      });

      // if the nearest point between the user/driver is less than equal 500meters
      // add the driver to to possible ones
      if (nearestPoint?.properties?.dist <= 500) {
        outTracks.push(track);
      }
    }

    // sends back the list
    return outTracks;
  }
}

const tracks = new Track("track");
export default tracks;
