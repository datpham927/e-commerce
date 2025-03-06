"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Supplier = require("../models/supplier.model");
const Product = require("../models/product.model");
const ImportHistory = require("../models/ImportHistory");

class SupplierService {
  // Thêm nhà cung cấp mới
  static async createSupplier({ supplier_name, supplier_contact, supplier_email, supplier_address, supplier_phone, supplier_description }) {
    if (!supplier_name || !supplier_contact || !supplier_email || !supplier_phone) {
      throw new BadRequestError("Thông tin không hợp lệ.");
    }

    const newSupplier = await Supplier.create({
      supplier_name,
      supplier_contact,
      supplier_email,
      supplier_address,
      supplier_phone,
      supplier_description,
    });

    return newSupplier;
  }

  // Lấy danh sách tất cả nhà cung cấp
  static async getAllSuppliers() {
    const suppliers = await Supplier.find().lean();
    return suppliers;
  }

  // Lấy thông tin chi tiết nhà cung cấp theo ID
  static async getSupplierById(supplierId) {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) throw new NotFoundError("Nhà cung cấp không tồn tại.");

    return supplier;
  }

  // Cập nhật thông tin nhà cung cấp
  static async updateSupplier(supplierId, updateData) {
    const supplier = await Supplier.findByIdAndUpdate(supplierId, updateData, { new: true, runValidators: true });
    if (!supplier) throw new NotFoundError("Nhà cung cấp không tồn tại.");

    return supplier;
  }

  // Xóa nhà cung cấp
  static async deleteSupplier(supplierId) {
    const supplier = await Supplier.findByIdAndDelete(supplierId);
    if (!supplier) throw new NotFoundError("Nhà cung cấp không tồn tại.");

    return { message: "Nhà cung cấp đã được xóa thành công." };
  }
  static async restockProducts({supplierId, productId,quantity,price}) {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) throw new Error("Nhà cung cấp không tồn tại");

        const product = await Product.findById(productId);
        if (!product) throw new Error(`Không tìm thấy sản phẩm có ID: ${productId}`);

        product.product_stock += quantity; // Cập nhật kho hàng
        product.product_price += price; // Cập nhật kho hàng

        await product.save();

        // Lưu lịch sử nhập hàng
        await ImportHistory.create({ supplier_id: supplierId, product_id: productId, quantity,price });

    return { message: "Nhập hàng thành công, tồn kho đã được cập nhật!" };
}
static async getImportHistory(req, res) {
  try {
      const history = await ImportHistory.find()
          .populate("supplier_id", "supplier_name")
          .populate("product_id", "product_name");

      return res.status(200).json(history);
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
}
}

module.exports = SupplierService;
