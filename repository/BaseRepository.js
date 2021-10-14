import { nanoid } from "nanoid";
import { getDb, write } from "../utils/db";

/**
 * This class handles the interactions with data in the database
 * and make it possible to reuse it for different type of entity
 * using the modelName variable.
 *
 * External classes can inherit from this to have a standardized way
 * to access data while also allowing child classes to extend
 * functionalities that are only relative to their entity.
 */
export default class BaseRepository {
  constructor(modelName) {
    this.modelName = modelName;

    // get the portion of database about a model, eg: users
    this.db = getDb(this.modelName);
  }

  // tells the database to write the data we have in memory
  persist() {
    return write();
  }

  /**
   * This function helps generating a query for the database either in
   * AND or in OR
   */
  queryBuilder(query = {}, interpolation = "every") {
    const condition = Object.entries(query);
    return (resource) =>
      condition[interpolation](([key, value]) => resource[key] === value);
  }

  /**
   * Perform a full table scan and returns a list of entity
   * that match the properties requested in the query object.
   * Interpolation allows to modify the query to be an AND/OR.
   */
  findByQuery(query = {}, interpolation) {
    return this.db.filter(this.queryBuilder(query, interpolation));
  }

  /**
   * As {findByQuery} but stop the table scan at the first found entity
   */
  findOne(query = {}, interpolation) {
    return this.db.find(this.queryBuilder(query, interpolation));
  }

  /**
   * CRUD Methods
   * Those methods are used by the routers to fetch data and masks
   * the query methods for a simpler usage by the developers.
   */

  /**
   * Find an entity by ID
   */
  show(resourceId) {
    return this.findOne({ id: resourceId });
  }

  /**
   * Find all entities by the provided query
   */
  index(query = {}, interpolation) {
    return this.findByQuery(query, interpolation);
  }

  /**
   * Store an entity in the database
   * For each entity an UNIQUE Identifier (Id) is generated
   */
  store(data) {
    data.id = nanoid();
    this.db.push(data);
    this.persist();
    return data;
  }

  /**
   * Finds an entity by ID and then modify it with the data provided
   */
  update(resourceId, body = {}) {
    const item = Object.assign(this.findOne({ id: resourceId }), body);
    this.persist();
    return item;
  }

  /**
   * Finds an entity in the database and then deletes it!
   */
  destroy(id) {
    const index = this.db.findIndex((item) => item.id === id);
    this.db.splice(index, 1);
    this.persist();
    return null;
  }
}
