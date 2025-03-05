const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    permissions: { type: [String], default: [], required: true } // Mảng quyền
}, {
    timestamps: true,
});

module.exports = mongoose.model("Role", RoleSchema);
