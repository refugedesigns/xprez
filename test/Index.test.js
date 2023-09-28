const Xprez = require("../lib/index");
const assert = require("assert");
const axios = require("axios");
const cors = require("cors")
const bodyParser = require("body-parser");

describe("Xprez", () => {
  let server;
  afterEach(() => {
    server && server.close();
  });

  it("works in the basic Hello, World case", async function () {
    this.timeout(10000);
    const app = new Xprez();

    app.use((req, res, next) => {
      res.end("Hello, world");
      next();
    });

    server = app.listen(3000);
    try {
      const response = await axios.get("http://localhost:3000");
      assert.equal(response.data, "Hello, world");
    } catch (error) {
      throw error;
    }
  });

  it("works with real Express middleware (CORS)", async function () {
    const app = new Xprez();;
    app.use(cors());
    app.use((req, res, next) => {
      res.end("Hello with CORS");
      next();
    });
    server = app.listen(3000);
    const res = await axios.get("http://localhost:3000");
    // This is the header that `cors()` should set
    assert.equal(res.headers["access-control-allow-origin"], "*");
    assert.equal(res.data, "Hello with CORS");
  });

  it("should parse request body correctly", async () => {
    const app = new Xprez();
    app.use(bodyParser.json());

    app.post("/", (req, res, next) => {
      res.end(JSON.stringify(req.body));
      next();
    });

    server = app.listen(3000);

    try {
      const response = await axios.post("http://localhost:3000", {
        message: "Hello, world",
      });

      assert.deepEqual(response.data, { message: "Hello, world" });
    } catch (error) {
      throw error;
    } 
  });

  it("should handle URL parameters correctly", async () => {
    const app = new Xprez();

    app.get("/greet/:name", (req, res, next) => {
      const name = req.params.name;
 
      res.end(`Hello, ${name}!`);
      next();
    });

    const server = app.listen(3000);

    try {
      const response = await axios.get("http://localhost:3000/greet/John");
      assert.equal(response.data, "Hello, John!");
    } catch (error) {
      throw error;
    } finally {
      server.close();
    }
  });
});
