# Xprez - A Lightweight Express.js Alternative

Xprez is a lightweight web framework inspired by Express.js, designed to simplify the process of building web applications and APIs in Node.js. It provides a minimalistic and flexible approach to handling HTTP requests and middleware.

## Features

- **Middleware Pipeline:** Xprez uses a middleware pipeline architecture that allows you to define and execute middleware functions in a specific order for incoming HTTP requests.

- **Routing:** Define routes for different HTTP methods (GET, POST, etc.) and URL patterns using a simple API.

- **Parameter Handling:** Easily extract URL parameters from incoming requests using a familiar syntax.

- **Extensible:** You can extend and customize Xprez with your own middleware and functionality.

## Installation

To use Xprez in your Node.js project, you can install it via npm:

```bash
npm install xprezz
```

## Usage
Here's a basic example of how to use Xprez to create a simple HTTP server:

```javascript
const Xprez = require("xprezz");

const app = new Xprez();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## Middleware
You can use middleware to process requests before they reach your route handlers. Xprez allows you to add middleware functions using the use method:

```javascript
app.use((req, res, next) => {
  // Your middleware logic here
  next(); // Call next to pass control to the next middleware or route handler
});
```

## Routing
Xprez provides a simple routing mechanism to define route handlers for different HTTP methods and URL patterns:

```javascript
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  // Fetch user data and send a response
  res.end(`userId: ${userId}`)
});
```



