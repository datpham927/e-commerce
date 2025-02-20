const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    // admin, nhân viên, nhân viên tư vấn
    name: { type: String, unique: true, required: true },
    // Lưu danh sách quyền trực tiếp ví dụ: ["user_manage", "category_manage", "product_manage"]
    permissions: [{ type: String, required: true }]
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model("Role", RoleSchema);
