// Import mongoose
const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    text: {
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