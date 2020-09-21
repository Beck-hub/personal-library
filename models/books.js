const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let bookSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    comments: []
})
module.exports = new mongoose.model("Books", bookSchema)
