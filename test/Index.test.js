const Xprez = require("../lib/index");
const assert = require("assert");
const axios = require("axios");

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
});
