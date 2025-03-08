const UserVoucherService = require("../services/userVoucher.service");

const UserVoucherController = {
    // lưu voucher
    saveVoucherForUser: async (req, res) => {
        const { voucherId } = req.body
        const vouchers = await UserVoucherService.saveVoucherForUser(req.user._id, voucherId);
        res.status(200).json({ success: true, data: vouchers });
    },
    // đổi voucher bằng điểm 
    redeemVoucher: async (req, res) => {
        const { voucherId } = req.body
        const vouchers = await UserVoucherService.redeemVoucher(req.user._id, voucherId);
        res.status(200).json({ success: true, data: vouchers });
    },
    getVoucherByUser: async (req, res) => {
        const vouchers = await UserVoucherService.getVoucherByUser(req.user._id);
        res.status(200).json({ success: true, data: vouchers });
    },
};

module.exports = UserVoucherController;