/**
 * This function extract the longitude and latitude of the school!
 *
 * Most used functions are "extracted" from code and saved in a file that can
 * be used from more part of you projects, we call them "shared/common" library!
 *
 * Curiosity: For PC gamers, that's what DLL files are, reusable code used by more games/programs on windows
 *
 * @returns {number[]} - [lng,lat]
 */
const getSchoolCoordinates = () =>
  process.env.SCHOOL_COORDINATES.split(",").map((n) => parseFloat(n, 10));

export default getSchoolCoordinates;
