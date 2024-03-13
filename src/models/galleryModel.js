const mongoose = require("mongoose")

const gallerySchema = new mongoose.Schema(
    {
        title: {
        type: String,
        required: true
        },
        image: {
        type: Object,
        required: true
        },
      },
    {timestamps: true}
)

module.exports = mongoose.model("gallery", gallerySchema)