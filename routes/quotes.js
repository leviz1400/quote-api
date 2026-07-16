const express = require("express");
const router = express.Router();
const quote = require("../models/quote");

// Getting all quotes
router.get("/", async (req, res) => {
    try {
        const quotes = await quote.find();
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
router.post("/", async (req, res) => {
    const postedQuote = new quote({
        quoteAuthor: req.body.quoteAuthor,
        quoteText: req.body.quoteText
    })
    try {
        const newQuote = await postedQuote.save();
        res.status(201).json(newQuote);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// Updating one quote
router.patch("/:id", getQuote, async (req, res) => {
    if (req.body.quoteAuthor != null) {
        res.quote.quoteAuthor = req.body.quoteAuthor;
    }
    if (req.body.quoteText != null) {
        res.quote.quoteText = req.body.quoteText;
    }
    try {
        const updatedQuote = await res.quote.save()
        res.json(updatedQuote);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// Deleting one quote
router.delete("/:id", getQuote, async (req, res) => {
    try {
        await res.quote.deleteOne();
        res.json({ message: "Deleted quote" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

async function getQuote(req, res, next) {
    let fetchedQuote
    try {
        fetchedQuote = await quote.findById(req.params.id);
        if (!fetchedQuote) {
            return res.status(404).json({ message: "Cannot find quote" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.quote = fetchedQuote;
    next();
}


module.exports = router;