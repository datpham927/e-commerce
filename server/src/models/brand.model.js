const mongoose = require("mongoose")
const slugify = require("slugify")

const brandSchema = mongoose.Schema({
    brand_name: { type: String, require: true },
    brand_code: { type: String, require: true },
    brand_thumb: { type: String, require: true },
    brand_slug: { type: String, require: true },
    brand_banner_image: { type: String, require: true },

}, {
    timestamps: true
})
brandSchema.pre("save", function (next) {
    this.brand_slug = slugify(this.brand_name, { lower: true })
    next();
})
module.exports = mongoose.model("Brand", brandSchema)