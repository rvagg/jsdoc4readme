/**
 * @typedef {import('./types.js').Options} Options
 */

/**
 * A thing that stores widgets.
 *
 * See {@link Store#get} for retrieval.
 *
 * @name Store
 * @class
 * @property {number} size - Number of widgets held.
 */
export class Store {
  /**
   * @constructs Store
   * @param {Options} [options] - Store options.
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Fetch a widget by key.
   *
   * @function
   * @memberof Store
   * @instance
   * @async
   * @param {string} key - The key.
   * @param {{ timeout?: number }} [options] - Fetch options.
   * @returns {Promise<import('./types.js').Widget | null>} The widget, if found.
   */
  async get (key, options) {
    return null
  }

  /**
   * Iterate over all keys.
   *
   * @function
   * @memberof Store
   * @instance
   * @generator
   * @returns {Iterable<string>}
   */
  * keys () {}

  /**
   * Create a store from a reader function, see also
   * {@link Store#count
   * `count()`}.
   *
   * @function
   * @memberof Store
   * @static
   * @param {() => Promise<Uint8Array>} read - Supplies bytes.
   * @param {Array<string>} tags - Tags to apply.
   * @param {number} [limit=10] - Maximum widgets.
   * @returns {Store & Iterable<string>}
   */
  static from (read, tags, limit = 10) {
    return new Store()
  }

  /**
   * Count the widgets.
   *
   * @returns The number of widgets.
   */
  count () {
    return 0
  }

  /**
   * Not for public consumption.
   *
   * @ignore
   */
  _secret () {}

  /**
   * Internal helper.
   *
   * @private
   */
  _helper () {}
}
