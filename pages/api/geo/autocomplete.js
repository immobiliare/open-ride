import apiWrapper from "utils/apiWrapper";
import { autocomplete } from "utils/openRouteClient";
import { validateRequest } from "utils/validator";

export default apiWrapper({
  // Accept only GET HTTP Request
  method: "GET",

  // Checks that the input is in the correct format
  onRequest: [
    validateRequest(
      {
        type: "object",
        properties: {
          search: { type: "string", minLength: 1 },
        },
        required: ["search"],
        additionalProperties: false,
      },
      "query"
    ),
  ],

  controller: async (req, res) => {
    // Perform a network request to OpenRoute service to receive information about
    // requested address
    const geocoding = await autocomplete(req.query.search);

    // Those info will be use by the client to render the drop-down showing
    // possible addresses
    return res.json(geocoding);
  },
});
