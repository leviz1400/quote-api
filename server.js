// Must be at top: Loads environment variables from a .env file into process.env
require("dotenv").config();

// Import the Express framework
const express = require("express");
// Initialize the Express application instance (our server traffic controller)
const app = express();
// Define the network port the server will listen on
const port = 3000;

// Import the Mongoose library to interact with MongoDB
const mongoose = require("mongoose");
// Establish a connection to the MongoDB database using the URI string from environment variables
mongoose.connect(process.env.MONGODB_URI);

// Grab the active database connection object to monitor its status
const db = mongoose.connection;
// Event Listener: If a database error occurs, log it to the console
db.on("error", (error) => { console.log(error) });
// Event Listener: Once the database successfully connects, log a success message
db.once("open", () => { console.log("Connected to Database") });

// Built-in Middleware: Tells Express to automatically parse incoming JSON request bodies.
// This makes the data available under `req.body` in your routes.
app.use(express.json());

// Import the router file containing all our individual quote endpoints
const quotesRouter = require("./routes/quotes");
// Mount the router: Any incoming HTTP request starting with "/quotes" will be routed to quotesRouter
app.use("/quotes", quotesRouter);

// Start the server and listen for incoming HTTP requests on port 3000
app.listen(port, () => {
    console.log("Server started");
});