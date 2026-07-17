const express = require("express");
// Create an isolated Router instance to handle paths cleanly without cluttering server.js
const router = express.Router();
// Import the database model so we can perform CRUD operations on the quotes collection
const Quote = require("../models/Quote");

// =========================================================================
// GET: Fetch all quotes
// Matches: GET /quotes/
// =========================================================================
router.get("/", async (req, res) => {
    try {
        // Query the database to find every single document in the quotes collection
        const quotes = await Quote.find();
        // Send the array of quotes back to the client as JSON (HTTP 200 OK by default)
        res.json(quotes);
    } catch (error) {
        // If the database fails, send back a 500 Internal Server Error status and the error message
        res.status(500).json({ message: error.message });
    }
});

// =========================================================================
// GET: Fetch a single quote by ID
// Matches: GET /quotes/:id (e.g., /quotes/60d5ecb54c251d5420d4f58c)
// Uses custom 'getQuote' middleware to look up the quote first
// =========================================================================
router.get("/:id", getQuote, (req, res) => {
    // getQuote middleware successfully found the quote and stored it in res.quote, so we send it back
    res.json(res.quote);
});

// =========================================================================
// POST: Create a new quote
// Matches: POST /quotes/
// =========================================================================
router.post("/", async (req, res) => {
    // Create a new instance of the Quote model using data passed in the request body
    const postedQuote = new Quote({
        author: req.body.author,
        text: req.body.text
    });
    try {
        // Save the new document permanently into the MongoDB database
        const newQuote = await postedQuote.save();
        // HTTP 201 means "Created successfully". Send the newly created quote back to the user.
        res.status(201).json(newQuote);
    } catch (error) {
        // HTTP 400 means "Bad Request" (e.g., missing required fields). Send the error details.
        res.status(400).json({ message: error.message });
    }
});

// =========================================================================
// PATCH: Partially update an existing quote
// Matches: PATCH /quotes/:id
// Uses custom 'getQuote' middleware to fetch the target quote first
// =========================================================================
router.patch("/:id", getQuote, async (req, res) => {
    // If the user provided a new author in the request body, update it on the existing record
    if (req.body.author != null) {
        res.quote.author = req.body.author;
    }
    // If the user provided new text in the request body, update it on the existing record
    if (req.body.text != null) {
        res.quote.text = req.body.text;
    }
    try {
        // Save the modified quote document back to the database
        const updatedQuote = await res.quote.save();
        // Return the updated quote to the client
        res.json(updatedQuote);
    } catch (error) {
        // Return 400 if validation fails (e.g., setting a required field to an invalid value)
        res.status(400).json({ message: error.message });
    }
});

// =========================================================================
// DELETE: Remove an existing quote
// Matches: DELETE /quotes/:id
// Uses custom 'getQuote' middleware to fetch the target quote first
// =========================================================================
router.delete("/:id", getQuote, async (req, res) => {
    try {
        // Delete the retrieved quote document out of the database collection
        await res.quote.deleteOne();
        // Respond with a friendly confirmation message
        res.json({ message: "Deleted quote" });
    } catch (error) {
        // Return 500 if the database runs into a technical deletion problem
        res.status(500).json({ message: error.message });
    }
});

// =========================================================================
// CUSTOM MIDDLEWARE FUNCTION: getQuote
// Reusable helper function that grabs a specific quote from the DB by its ID URL parameter.
// It intercepts the request before it reaches the main route handlers above.
// =========================================================================
async function getQuote(req, res, next) {
    let quote;
    try {
        // Look up a specific quote using the ID passed in the URL (req.params.id)
        quote = await Quote.findById(req.params.id);
        // If no document matches that ID, immediately stop and return a 404 Not Found error
        if (!quote) {
            return res.status(404).json({ message: "Cannot find quote" });
        }
    } catch (error) {
        // If the ID format is completely broken or a server error happens, return a 500 error
        return res.status(500).json({ message: error.message });
    }
    
    // If the quote is successfully found, attach it to the `res` object so subsequent functions can access it
    res.quote = quote;
    // Tell Express to move out of this middleware and execute the next handler in the chain
    next();
}

// Export the router so server.js can import and use it
module.exports = router;