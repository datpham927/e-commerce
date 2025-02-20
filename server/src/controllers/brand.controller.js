const BrandService = require("../services/brand.service");

const BrandController = {
    // Thêm thương hiệu mới
    createBrand: (async (req, res) => {
        const brand = await BrandService.createBrand(req.body);
        res.status(201).json({ success: true, data: brand });
    }),

    // Lấy danh sách tất cả thương hiệu
    getAllBrands: (async (req, res) => {
        const brands = await BrandService.getAllBrands();
        res.status(200).json({ success: true, data: brands });
    }),

    // Lấy chi tiết thương hiệu theo ID
    getBrandById:(async (req, res) => {
        const brand = await BrandService.getBrandById(req.params.id);
        res.status(200).json({ success: true, data: brand });
    }),

    // Cập nhật thương hiệu theo ID
    updateBrand:(async (req, res) => {
        const updatedBrand = await BrandService.updateBrand(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedBrand });
    }),

    // Xóa thương hiệu theo ID
    deleteBrand:(async (req, res) => {
        await BrandService.deleteBrand(req.params.id);
        res.status(200).json({ success: true, message: "Xóa thương hiệu thành công!" });
    })
};

module.exports = BrandController;
