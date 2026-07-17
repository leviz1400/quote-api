const mongoose = require("mongoose");

// Define the blueprint structure (Schema) for how every "Quote" document must look in MongoDB
const quoteSchema = new mongoose.Schema({
    author: {
        type: String,   // Must be text strings
        required: true  // The database will reject the save if this field is missing
    },
    text: {
        type: String,   // Must be text strings
        required: true  // The database will reject the save if this field is missing
    },
    quoteAccessedDate: {
        type: Date,     // Must be a valid JavaScript Date type
        required: true,
        default: Date.now // If not provided during creation, automatically set this to the exact current timestamp
    }
});

// Compile the schema into an active Mongoose Model named "quote", and export it.
// Mongoose automatically looks for a collection named "quotes" (pluralized lowercase) in your database.
module.exports = mongoose.model("quote", quoteSchema);
