const {pathToRegexp} = require("path-to-regexp");

class Layer {
  /**
   * Creates a new instance of the constructor.
   *
   * @param {type} method - The HTTP method for the API request.
   * @param {type} url - The URL for the API request.
   * @param {type} middleware - An array of middleware functions to be executed before the API request.
   */
  constructor(method, url, middleware, opts) {
    this.method = method;
    this.path = "";
    if (url != null) {
      this.keys = [];

      this.url = pathToRegexp(url, this.keys, opts);
    }
    this.middleware = middleware;
  }

  /**
   * Matches the given method and URL against the stored method and URL.
   *
   * @param {string} method - The HTTP method to match.
   * @param {string} url - The URL to match.
   * @return {boolean} - Returns true if the method and URL match, otherwise false.
   */
  match(method, url) {
    if (this.method != null && this.method !== method) {
      return false;
    }

    if (this.url != null) {
      const match = this.url.exec(url);

      if (match == null) return false;

      this.path = match[0];

      this.params = {}

      for (let i = 1; i < match.length; i++) {
        this.params[this.keys[i - 1].name] = decodeURIComponent(match[i]);
      }
    }
    return true;
  }
}

module.exports = Layer;
