const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
    quoteAuthor: {
        type: String,
        required: true
    },
    quoteText: {
        type: String,
        required: true
    },
    quoteAccessedDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model("quote", quoteSchema);