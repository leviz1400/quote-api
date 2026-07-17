const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote");

// Getting all quotes
router.get("/", async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// Getting one quote
router.get("/:id", getQuote, (req, res) => {
    res.json(res.quote);
})
// Creating one quote
router.post("/", authenticateApiKey, async (req, res) => {
    const postedQuote = new Quote({
        author: req.body.author,
        text: req.body.text
    })
    try {
        const newQuote = await postedQuote.save();
        res.status(201).json(newQuote);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// Updating one quote
router.patch("/:id", authenticateApiKey, getQuote, async (req, res) => {
    if (req.body.author != null) {
        res.quote.author = req.body.author;
    }
    if (req.body.text != null) {
        res.quote.text = req.body.text;
    }
    try {
        const updatedQuote = await res.quote.save()
        res.json(updatedQuote);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// Deleting one quote
router.delete("/:id", authenticateApiKey, getQuote, async (req, res) => {
    try {
        await res.quote.deleteOne();
        res.json({ message: "Deleted quote" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

async function getQuote(req, res, next) {
    let quote;
    try {
        quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: "Cannot find quote" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.quote = quote;
    next();
}

function authenticateApiKey(req, res, next) {
    const apiKey = req.header("X-API-KEY");
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ message: "Unauthorized: Invalid API Key" });
    }
    next(); // Pass control to the actual route handler
}


module.exports = router;