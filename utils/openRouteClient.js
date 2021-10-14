import got from "got";
import { ApiError } from "next/dist/server/api-utils";

// We initialized an Outgoing Client that call external service using HTTP
// much like the browser call our server using HTTP to have the Web Page in return.
const client = got.extend({
  prefixUrl: "http://api.openrouteservice.org",
  hooks: {
    beforeRequest: [
      (options) => {
        options.headers.authorization = process.env.OPENROUTE_APIKEY;
      },
    ],
  },
});

/**
 * We ask the external service to give us the route between coordinates A->B->C
 * With infos on durations if we are using a car
 */
export async function getDirections(stops = []) {
  const { body } = await client.post("v2/directions/driving-car/geojson", {
    json: {
      coordinates: stops,
    },
  });
  try {
    return JSON.parse(body);
  } catch (e) {
    throw new ApiError(500, "OpenRouteError" + e.response);
  }
}

/**
 * We ask the external service to give us information about an Address
 * This is used by the client to create autocompletes when you inputs you
 * address/city!
 */
export async function autocomplete(searchTerm = "") {
  return client
    .get("geocode/autocomplete", {
      searchParams: {
        text: searchTerm,
        "boundary.country": "ITA",

        // We tell the service to restrict research on Rome only!
        // Those 4 values express 2 points on the diagonal of a rectagle
        // using the longitude an latitudes, this allows to draw a rectagle on maps!
        "boundary.rect.min_lon": 12.200317,
        "boundary.rect.max_lon": 12.64389,
        "boundary.rect.min_lat": 41.784625,
        "boundary.rect.max_lat": 42.067646,
      },
    })
    .json();
}
