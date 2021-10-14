import * as jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "repository/User";

/**
 * When users gets logged in there need to be a way
 * to keep them logged in without retyping username/password
 * on each page. To do so every time they log-in a session
 * is created, and a token of some kind is sent back to the
 * client. On each request the client send the server the user token
 * the server decode the token and check if is valid and retrieve
 * the users the token belongs to, this help us idendity who
 * is asking for data.
 */

const verifyAsync = promisify(jwt.verify);
const signAsync = promisify(jwt.sign);

/**
 * Decode the token provided by the client app
 */
export function decode(token) {
  return verifyAsync(token, process.env.APP_SECRET);
}

/**
 * Use the info about the user to create its authorization token
 */
export function encode(user) {
  if (!user?.id) throw new Error("JWTMissingUserId");
  return signAsync(user, process.env.APP_SECRET, { expiresIn: "1d" });
}

/**
 * On every request that need authentication we check if the
 * client has provided the token, we then decode it and use
 * it to check if an user exists then add the user object
 * to the current request session.
 */
export async function checkAuthentication(req) {
  const token = req.cookies?.token || req.headers?.authorization;
  if (!token) throw new Error("JWTMissingAuthToken");
  const { id } = await decode(token.replace(/bearer/i, ""));
  req.user = User.show(id);
  if (!req.user) throw new Error("JWTInvalidAuthToken");
}
