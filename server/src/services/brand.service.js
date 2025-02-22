const Brand = require("../models/brand.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const BrandService = {
    // Tạo thương hiệu mới
    createBrand: async (payload) => {
        if (!payload.brand_name || !payload.brand_thumb || !payload.brand_banner_image) {
            throw new BadRequestError("Thiếu thông tin bắt buộc!");
        }
        return await Brand.create(payload);
    },

    // Lấy danh sách tất cả thương hiệu
    getAllBrands: async () => {
        return await Brand.find();
    },

    // Lấy thương hiệu theo ID
    getBrandById: async (id) => {
        const brand = await Brand.findById(id);
        if (!brand) throw new NotFoundError("Thương hiệu không tồn tại!");
        return brand;
    },

    // Cập nhật thương hiệu theo ID
    updateBrand: async (id, payload) => {
        const updatedBrand = await Brand.findByIdAndUpdate(id, payload, { new: true });
        if (!updatedBrand) throw new NotFoundError("Thương hiệu không tồn tại!");
        return updatedBrand;
    },

    // Xóa thương hiệu theo ID
    deleteBrand: async (id) => {
        const brand = await Brand.findByIdAndDelete(id);
        if (!brand) throw new NotFoundError("Thương hiệu không tồn tại!");
        return brand;
    },

    // 🔹 Tìm kiếm thương hiệu theo tên
    searchBrandByName: async (name) => {
        const brands = await Brand.find({ brand_name: { $regex: name, $options: "i" } });
        return brands;
    }
};

module.exports = BrandService;
