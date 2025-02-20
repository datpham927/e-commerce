"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
    admin_name: { type: String, required: true, unique: true },
    admin_avatar_url: { type: String },
    admin_email: { type: String, unique: true, required: true },
    admin_phone: { type: String, unique: true, required: true },
    admin_password: { type: String, required: true },
    // vai trò
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }// Lưu tên role
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model("Admin", AdminSchema);
