import Cookies from "cookies";
import { DriverView } from "components/DriverView";
import { Landing } from "components/Landing";
import { decode } from "utils/jwt";
import User from "repository/User";
import { PassengerView } from "components/PassengerView";
import getSchoolCoordinates from "utils/schoolCoordinates";

/**
 * This component define the homepage
 * We show different componet dependending on the type of user
 * if no user we show the landing page by default
 */
export default function Index({ user, schoolCoordinates }) {
  switch (user?.userType) {
    case "driver":
      return <DriverView user={user} schoolCoordinates={schoolCoordinates} />;
    case "passenger":
      return <PassengerView user={user} />;
    default:
      return <Landing />;
  }
}

/**
 * Before showing the page we get data on the server
 */
export const getServerSideProps = async (ctx) => {
  const returnProps = { props: {} };

  // we check the cookie in the browser if exist
  // we also check it's a valid token
  // and then getting the user information from DB
  const cookies = new Cookies(ctx.req, ctx.res);
  const auth = cookies.get("token") || null;
  if (auth) {
    try {
      const data = await decode(auth);
      const user = await User.show(data.id);
      const [lng, lat] = getSchoolCoordinates();

      return {
        props: {
          user,
          schoolCoordinates: {
            lat,
            lng,
          },
        },
      };
    } catch {
      cookies.set("token"); // remove token from client
      // Token invalid or expired, prompt user to re-login
      return returnProps;
    }
  }

  return returnProps;
};
