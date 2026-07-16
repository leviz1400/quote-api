// Must be at top
require("dotenv").config();

// Create express app and porting
const express = require("express");
const app = express();
const port = 3000;

// Import mongoose and connect

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection
db.on("error", (error) => {console.log(error)});
db.once("open", () => {console.log("Connected to Database")})

app.use(express.json())

const quotesRouter = require("./routes/quotes");
app.use("/quotes", quotesRouter);

app.listen(port, () => {
    console.log("Server started");
})