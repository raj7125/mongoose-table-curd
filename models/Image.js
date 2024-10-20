const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  imagePath: { type: String, required: true }, 
});

module.exports = mongoose.model("Image", imageSchema);
