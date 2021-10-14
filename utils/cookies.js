import Cookies from "cookies";

export const setAccessTokenCookie = (req, res, token) => {
  const cookies = new Cookies(req, res);
  return cookies.set("token", token, {
    httpOnly: true,
  });
};
