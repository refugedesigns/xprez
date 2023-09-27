const Xprez = require("./lib/index");

const app = new Xprez();

app.use((req, res, next) => {
  next();
  res.end("Hello, world");
});

app.listen(8000, () => console.log("App is running on port 3000"));
