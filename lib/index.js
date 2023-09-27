const http = require("http");
const MiddlewarePipeline = require("./middleware-pipeline");


class Xprez extends MiddlewarePipeline {
/**
 * Listen for incoming requests on the specified port and handle them using the provided callback function.
 *
 * @param {number} port - The port number to listen on.
 * @param {function} callback - The callback function to be called when the server starts listening.
 * @return {http.Server} The HTTP server instance that is listening on the specified port.
 */
  listen(port, callback) {
    /**
     * Handles the request and response.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    const handler = (req, res) => {
      this.handle(req, res, (err) => {
        if (err) {
          res.writeHead(500);
          res.end("Internal Server Error");
        }
      });
    };

    return http.createServer(handler).listen({ port }, callback);
  }

}

/**
 * Creates a new router function.
 *
 * @return {function} A router function that can handle incoming requests.
 */
function Router() {
    const router = function router(req, res, next) {
        router.handle.call(router, req, res, next);
    }

    Object.setPrototypeOf(router, new MiddlewarePipeline());

    return router;
}

Xprez.Router = Router;

module.exports = Xprez