const mongoose = require("mongoose")
const slugify = require("slugify")

const categorySchema = mongoose.Schema({
    category_name: { type: String, require: true },
    category_code: { type: String, require: true },
    category_thumb: { type: String, require: true },
    category_slug: { type: String, require: true },
}, {
    timestamps: true
})
categorySchema.pre("save", function (next) {
    this.category_slug = slugify(this.category_name, { lower: true })
    next();
})
module.exports = mongoose.model("Category", categorySchema)