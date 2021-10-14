import { inside, bboxPolygon } from "@turf/turf";
import { ApiError } from "next/dist/server/api-utils";
import BaseRepository from "repository/BaseRepository";
import { omit } from "lodash";
import crypto from "crypto";

/**
 * This class uses methods exposed by the BaseRepository to save
 * the data of each users who sign-up for the app
 *
 * The User table usually is the on of the most importat part of an app
 * It cointain important and sensitive data that needs to be threated
 * with more care and sometimes encrypted (eg: passwords).
 *
 */

class User extends BaseRepository {
  get schema() {
    const coordinates = {
      type: "object",
      properties: {
        lat: { type: "number" },
        lng: { type: "number" },
      },
      required: ["lat", "lng"],
    };
    return {
      type: "object",
      properties: {
        username: { type: "string", minLength: 1 },
        password: { type: "string", minLength: 1 },
        firstName: { type: "string", minLength: 1 },
        lastName: { type: "string", minLength: 1 },
        class: { type: "string", minLength: 1 },
        address: { type: "string", minLength: 1 },
        coordinates,
        userType: {
          type: "string",
          enum: ["admin", "driver", "passenger"],
          default: "passenger",
        },
        transportType: {
          type: "string",
          enum: ["car", "scooter"],
        },
        seats: { type: "integer", default: 1 },
      },
      required: [
        "username",
        "password",
        "firstName",
        "lastName",
        "class",
        "address",
        "userType",
        "coordinates",
      ],
      additionalProperties: false,
    };
  }

  /**
   * This function "overrides" the base show to remove
   * the password from the output Why? Because if we send
   * back the hashed password we have in DB we would have
   * a serious security problem!
   *
   * All the functions below do the same!
   */
  show(userId) {
    const storedUser = super.show(userId);
    if (!storedUser) return null;
    return omit(storedUser, ["password"]);
  }

  update(id, data) {
    return super.update(id, omit(data, ["password", "username"]));
  }

  index(query = {}) {
    const users = super.index(query);
    return users.map((u) => omit(u, ["password"]));
  }

  /**
   * This function "overrides" the basic save procedure adding
   * more functionality only for the "users"
   */
  store(data) {
    // If an user already exists with this user name
    // send back the error to the client
    if (this.findOne({ username: data.username.toLowerCase() })) {
      throw new ApiError(400, "UsernameAlreadyExists");
    }
    // We force username to be lowercase
    // (differnt apps use different constraints)
    data.username = data.username.toLowerCase();

    // We NEVER store password in cleartext, we first
    // encrypt them, more below @:124
    data.password = this.hashPassword(data.password);

    // store the user
    const result = super.store(data);

    // removes the saved hashed password from the results
    // so clients don't leak it.
    const user = omit(result, ["password"]);
    return user;
  }

  /**
   * Authentication function is used to check that the user
   * trying to login has provided the correct username/password pair
   */
  auth(data) {
    const user = this.findOne({
      username: data.username.toLowerCase(),
      password: this.hashPassword(data.password),
    });

    // if no user found the pair is not correct and we return errors
    if (!user) return null;

    // we remove the password from the resulting object
    return omit(user, ["password"]);
  }

  /**
   * This funcion is used encrypt (obfuscate) a password before saving it in the
   * database, this is done to secure users data so if a database leaks password
   * are not in clean-text and cannot be used by malicious party on this or
   * other apps (people reuse passwords).
   *
   * This technique is called hashing! An hashing algorithm is a mathematical
   * function that encrypt input to make it unreadable.
   * Eg: "mypassword" becomes mPzkgBwQYiAQNV7wCPIvdVblNyt10HqzquFoa6LcRTQ
   *
   * Hashing algorithms used for passwords are one-way, meaning that they
   * cannot be decoded by none (not even the server)!
   * How can we know if users input the correct password?
   * By matching the hashes!
   *
   * For example:
   *  - login("myusername", "mypassword")
   *    -> "mPzkgBwQYiAQNV7wCPIvdVblNyt10HqzquFoa6LcRTQ"
   *  - Search in db if I have an user `myuser`
   *    with a saved hash of "mPzkgBwQYiAQNV7wCPIvdVblNyt10HqzquFoa6LcRTQ".
   *
   * Curiosity: Twitch database leaked, but your passwords are unreadable!
   * Curiosity2: Encryption, in in a similar way, is used for two-way
   *  communication between computers (https, whatsapp, telegram)
   *
   */
  hashPassword(password) {
    return (
      crypto
        // curiosity: we use salts to avoid that
        // leaks of other apps compromise our users.
        .createHmac("sha512", process.env.APP_SECRET)
        .update(password)
        .digest("hex")
    );
  }
}

const users = new User("user");
export default users;
