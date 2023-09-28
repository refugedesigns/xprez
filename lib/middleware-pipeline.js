const Layer = require("./layer");

class MiddlewarePipeline {
  /**
   * Initializes a new instance of the class.
   */
  constructor() {
    this._stack = [];
  }

  /**
   * Adds a middleware function to the stack.
   *
   * @param {string} url - The URL path to match.
   * @param {function} middleware - The middleware function to add.
   */
  use(url, middleware) {
    if (arguments.length === 1) {
      middleware = url;
      url = null;
    }

    if (typeof middleware !== "function") {
      throw new Error("middleware is not a function");
    }

    this._stack.push(new Layer(null, url, middleware, {end: false}));
  }

  /**
   * Add a new route to the stack.
   *
   * @param {string} method - The HTTP method for the route.
   * @param {string} url - The URL pattern for the route.
   * @param {function} handler - The handler function for the route.
   * @return {object} - Returns the current instance of the router.
   */
  route(method, url, handler) {
    this._stack.push(new Layer(method, url, handler));
    return this;
  }

  /**
   * Get the specified URL using the given handler.
   *
   * @param {string} url - The URL to be retrieved.
   * @param {function} handler - The handler function to be called.
   * @return {any} The result of the route function.
   */
  get(url, handler) {
    return this.route("GET", url, handler);
  }

  /**
   * A description of the post function.
   *
   * @param {string} url - The URL to send the POST request to.
   * @param {function} handler - The handler function to be called when the POST request is successful.
   * @return {type} The result of the route function.
   */
  post(url, handler) {
    return this.route("POST", url, handler);
  }

  /**
   * Executes the next middleware function in the stack.
   *
   * @param {Error} err - An error object, if any.
   * @return {undefined}
   */
  handle(req, res, callback) {
    let index = 0;

    /**
     * Executes the next middleware function in the stack.
     *
     * @param {Error} err - An error object, if any.
     * @return {undefined}
     */
    const next = (err) => {
      if (err != null) {
        console.log(err)
        return setImmediate(() => callback(err));
      }

      if (index >= this._stack.length) {
        return setImmediate(() => callback());
      }

      let layer = this._stack[index++];

      while (index <= this._stack.length && !layer.match(req.method, req.url)) {
        layer = this._stack[index++];
      }

      if (layer == null) {
        return setImmediate(() => callback());
      }

      // Decorate 'req' with the layer's 'params'. Make sure to do it
      // outsite 'setImmediate()' because fo concurrency concerns.
      req.params = Object.assign({}, layer.params);

      const originalUrl = req.url;
      req.path = layer.path;
      req.url = req.url.substr(req.path.length);

      try {
        const retVal = layer.middleware(req, res, (err) =>
          {setImmediate(() => next(err))}
        );

        req.url = originalUrl;
        if (retVal instanceof Promise) {
          retVal.catch((err) => next(err));
        }
      } catch (error) {
        req.url = originalUrl;
        next(error);
      }
    };
    next();
  }
}


module.exports = MiddlewarePipeline;
