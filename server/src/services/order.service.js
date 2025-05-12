'use strict';

const Product = require('../models/product.model'); // Mô hình sản phẩm
const Voucher = require('../models/voucher.model'); // Mô hình mã giảm giá
const redisClient = require('../config/redisClient'); // sử dụng Redis client để thao tác
const userVoucherModel = require('../models/userVoucher.model');
const shippingCompany = require('../models/shippingCompany.model');
const { default: mongoose } = require('mongoose');
const PurchasedModel = require('../models/Purchased.model');
const OnlineOrder = require('../models/OnlineOrder');
const OfflineOrder = require('../models/OfflineOrder');
const { RequestError } = require('../core/error.response');
const userModel = require('../models/user.model');
const adminModel = require('../models/admin.model');

class OrderService {
    static async createOfflineOrder(payload) {
        const {
            adminId, // ID của người dùng đặt hàng
            order_payment_method, // Phương thức thanh toán
            order_voucherId, // ID mã giảm giá (nếu có)
            order_products, // Danh sách sản phẩm trong đơn hàng
        } = payload;
        // Bước 1: Kiểm tra sản phẩm
        // Kiểm tra tất cả sản phẩm trong danh sách order_products
        const productChecks = await Promise.all(
            order_products.map(async (item) => {
                const product = await Product.findById(item.productId); // Tìm sản phẩm trong DB theo ID
                if (!product) throw new NotFoundError('Không tìm thấy sản phẩm'); // Nếu không tìm thấy, báo lỗi
                return {
                    name: product.product_name, // Tên sản phẩm
                    available: product.product_quantity >= item.quantity, // Kiểm tra số lượng đủ hay không
                };
            }),
        );
        // Lọc ra các sản phẩm hết hàng
        const outOfStockProducts = productChecks
            .filter((check) => !check.available) // Lấy các sản phẩm không đủ số lượng
            .map((check) => check.name); // Lấy tên của các sản phẩm đó
        // Kiểm tra nếu có sản phẩm hết hàng thì báo lỗi với danh sách tên
        if (outOfStockProducts.length > 0) {
            throw new BadRequestError(`Các sản phẩm đã hết hàng: ${outOfStockProducts.join(', ')}`); // Báo lỗi với danh sách sản phẩm hết hàng
        }
        // Bước 2: Tính tổng tiền đơn hàng và bổ sung thông tin product list
        let totalPrice = 0;
        let totalApplyDiscount = 0;
        const productsToOrder = await Promise.all(
            order_products.map(async (item) => {
                const product = await Product.findById(item.productId); // Lấy thông tin sản phẩm
                // Tính giá sau khi áp dụng giảm giá (nếu có)
                totalApplyDiscount += (product.product_price * (100 - (product.product_discount || 0))) / 100;
                totalPrice += product.product_price * item.quantity; // Cộng dồn vào tổng giá trị
                return {
                    productId: product._id, // ID sản phẩm
                    price: product.product_price, // Giá gốc
                    quantity: item.quantity, // Số lượng đặt mua
                    discount: product.product_discount,
                };
            }),
        );
        // Bước 3: Xử lý mã giảm giá (nếu có)
        if (order_voucherId) {
            // Kiểm tra xem user đã sở hữu voucher chưa
            const userVoucher = await userVoucherModel.findOne({
                vc_user_id: userId,
                vc_vouchers: { $in: [order_voucherId] },
            });
            if (!userVoucher) {
                throw new NotFoundError('Bạn không sở hữu voucher này');
            }
            // Tìm mã giảm giá trong DB
            const voucher = await Voucher.findById(order_voucherId);
            if (!voucher) {
                throw new NotFoundError('Không tìm thấy voucher');
            }
            // Giá trị đơn hàng tối thiểu để áp dụng voucher
            if (totalPrice < voucher.voucher_min_order_value) {
                throw new BadRequestError(`Giá trị đơn hàng tối thiểu ${voucher.voucher_min_order_value}`);
            }
            if (voucher.voucher_method === 'percent') {
                // Nếu giảm giá theo phần trăm
                const discount = (totalPrice * voucher.voucher_value) / 100; // Tính số tiền giảm
                // Áp dụng giảm giá, nhưng không vượt quá giá trị tối đa của voucher
                totalApplyDiscount += Math.min(discount, voucher.voucher_max_price || Infinity);
            } else {
                // Nếu giảm giá theo số tiền cố định
                totalApplyDiscount += voucher.voucher_value; //
            }
        }
        const newOrder = await OfflineOrder.create([
            {
                order_staff: adminId,
                order_products: productsToOrder, // Danh sách sản phẩm
                order_voucher: order_voucherId, // Mã giảm giá (nếu có)
                order_total_price: totalPrice, // Tổng giá trị đơn hàng
                order_total_apply_discount: totalApplyDiscount, // tổng discount
                order_payment_method, // Phương thức thanh toán
            },
        ]);
        if (newOrder) {
            // Cập nhật số lượng sản phẩm trong kho
            await Promise.all(
                order_products.map((item) =>
                    Product.findByIdAndUpdate(item.productId, {
                        $inc: {
                            product_quantity: -item.quantity, // Giảm số lượng tồn kho
                            product_sold: item.quantity, // Tăng số lượng đã bán
                        },
                    }),
                ),
            );
        }
        return newOrder;
    }

    static async getAllOrdersOffline({ limit = 10, page = 0 }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const orders = await OfflineOrder.find()
            .select('order_code order_payment_method  order_total_apply_discount order_total_price order_products createdAt') // chọn thêm createdAt nếu cần
            .populate([
                {
                    path: 'order_products.productId',
                    select: 'product_name',
                },
                {
                    path: 'order_staff',
                    select: 'admin_name admin_mobile',
                },
            ])
            .sort({ createdAt: -1 }) // 🔥 Sắp xếp mới nhất trước
            .skip(skipNum)
            .limit(limitNum)
            .lean();
        const totalOrders = await OfflineOrder.countDocuments();
        return {
            totalPage: Math.ceil(totalOrders / limitNum), // Tổng số trang (0-based)
            currentPage: pageNum,
            totalOrders,
            orders,
        };
    }

    // Hàm tạo đơn hàng mới, nhận payload chứa thông tin đơn hàng
    static async createOrder(payload) {
        const {
            userId, // ID của người dùng đặt hàng
            order_shipping_company, // ID công ty vận chuyển
            order_shipping_address, // Địa chỉ giao hàng
            order_payment_method, // Phương thức thanh toán
            order_voucherId, // ID mã giảm giá (nếu có)
            order_products, // Danh sách sản phẩm trong đơn hàng
        } = payload;

        // Bước 1: Kiểm tra sản phẩm
        const productChecks = await Promise.all(
            order_products.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new RequestError('Không tìm thấy sản phẩm');
                return {
                    name: product.product_name,
                    available: product.product_quantity >= item.quantity,
                };
            }),
        );

        const outOfStockProducts = productChecks.filter((check) => !check.available).map((check) => check.name);

        if (outOfStockProducts.length > 0) {
            throw new RequestError(`Các sản phẩm đã hết hàng: ${outOfStockProducts.join(', ')}`);
        }

        // Bước 2: Tính tổng tiền đơn hàng và bổ sung thông tin product list
        let totalPrice = 0;
        let totalApplyDiscount = 0;
        const productsToOrder = await Promise.all(
            order_products.map(async (item) => {
                const product = await Product.findById(item.productId);
                totalApplyDiscount += (product.product_price * (product.product_discount || 0)) / 100;
                totalPrice += product.product_price * item.quantity;
                return {
                    productId: product._id,
                    price: product.product_price,
                    quantity: item.quantity,
                    discount: product.product_discount,
                };
            }),
        );

        // Bước 3: Xử lý mã giảm giá (nếu có)
        if (order_voucherId) {
            const userVoucher = await userVoucherModel.findOne({
                vc_user_id: userId,
                vc_vouchers: { $in: [order_voucherId] },
            });
            if (!userVoucher) {
                throw new RequestError('Bạn không sở hữu voucher này');
            }
            const voucher = await Voucher.findById(order_voucherId);
            if (!voucher) {
                throw new RequestError('Không tìm thấy voucher');
            }
            const hasUserUsedVoucher = voucher.voucher_users_used.some((userUsedId) => userUsedId.toString() === userId.toString());
            if (hasUserUsedVoucher) {
                throw new RequestError('Bạn đã đạt giới hạn số lần sử dụng voucher này');
            }
            if (totalPrice < voucher.voucher_min_order_value) {
                throw new RequestError(`Giá trị đơn hàng tối thiểu ${voucher.voucher_min_order_value}`);
            }
            if (voucher.voucher_method === 'percent') {
                const discount = (totalPrice * voucher.voucher_value) / 100;
                totalApplyDiscount += Math.min(discount, voucher.voucher_max_price || Infinity);
            } else {
                totalApplyDiscount += voucher.voucher_value;
            }
            await userVoucherModel.findOneAndUpdate({ vc_user_id: userId }, { $pull: { vc_vouchers: order_voucherId } }, { new: true, upsert: true });
        }

        // Bước 4: Thêm phí vận chuyển
        const shipping = await shippingCompany.findById(order_shipping_company);
        if (!shipping) throw new RequestError('Không tìm thấy công ty vận chuyển');
        const shippingPrice = shipping.sc_shipping_price;

        // Bước 5: Tính số tiền cần trả
        let amountDue = totalPrice - totalApplyDiscount + shippingPrice;

        // Bước 6: Xử lý thanh toán và số tiền đã trả
        let message = 'Đặt hàng thành công';
        let amountPaid = 0;
        let final_payment_method = order_payment_method; // New variable to handle payment method

        if (order_payment_method === 'COIN') {
            let user = await userModel.findById(userId);
            if (!user) throw new RequestError('Không tìm thấy người dùng');
            let userBalance = user.user_balance || 0;
            if (userBalance >= amountDue) {
                // Đủ tiền, trừ toàn bộ bằng coin
                await userModel.findByIdAndUpdate(userId, {
                    $inc: { user_balance: -amountDue },
                });
                amountPaid = amountDue;
                message = `Đặt hàng thành công, đã thanh toán toàn bộ bằng số dư: ${amountDue.toLocaleString()} đ`;
            } else {
                // Không đủ tiền => Trừ hết coin, phần còn lại thanh toán COD
                amountPaid = userBalance;
                let remaining = amountDue - userBalance;
                await userModel.findByIdAndUpdate(userId, {
                    $inc: { user_balance: -userBalance },
                });
                final_payment_method = 'COIN+CASH'; // Update payment method
                amountDue = remaining;
                message = `Đặt hàng thành công. Đã trừ toàn bộ số dư (${amountPaid.toLocaleString()} đ), còn lại thanh toán khi nhận hàng: ${remaining.toLocaleString()} đ`;
            }
        } else if (order_payment_method === 'VNPAY') {
            amountPaid = amountDue;
            message = `Đặt hàng thành công, đã thanh toán qua VNPAY: ${amountDue.toLocaleString()} đ`;
        }

        // Tạo đơn hàng mới trong DB
        const order_date_shipping = {
            from: new Date(Date.now() + shipping.sc_delivery_time.from * 24 * 60 * 60 * 1000),
            to: new Date(Date.now() + shipping.sc_delivery_time.to * 24 * 60 * 60 * 1000),
        };

        const newOrder = await OnlineOrder.create([
            {
                order_user: userId,
                order_products: productsToOrder,
                order_voucher: order_voucherId,
                order_total_price: totalPrice,
                order_total_apply_discount: totalApplyDiscount,
                order_date_shipping,
                order_payment_method: final_payment_method, // Use updated payment method
                order_shipping_address,
                order_shipping_price: shippingPrice,
                order_shipping_company,
                order_amount_due: amountDue, // Số tiền cần trả
                order_amount_paid: amountPaid, // Số tiền đã trả
            },
        ]);

        if (newOrder) {
            // Cập nhật số lượng sản phẩm trong kho
            await Promise.all(
                order_products.map((item) =>
                    Product.findByIdAndUpdate(item.productId, {
                        $inc: {
                            product_quantity: -item.quantity,
                            product_sold: item.quantity,
                        },
                    }),
                ),
            );

            // Cập nhật thông tin mã giảm giá (nếu có)
            if (order_voucherId) {
                await Voucher.findByIdAndUpdate(order_voucherId, { $push: { voucher_users_used: userId } });
            }

            // Cập nhật giỏ hàng trong Redis (nếu có)
            const cartKey = `cart:${userId}`;
            const cartData = await redisClient.get(cartKey);

            if (cartData) {
                const currentCart = JSON.parse(cartData);
                const updatedCart = currentCart.filter((item) => !order_products.some((op) => op.productId.toString() === item.productId.toString()));
                await redisClient.set(cartKey, JSON.stringify(updatedCart));
            }
        }
        return {
            order: newOrder,
            message,
        };
    }

    static async getAllOrdersByUser({ userId, status }) {
        const fillter = { order_user: userId };
        if (status) fillter.order_status = status;
        const orders = await OnlineOrder.find(fillter)
            .select(
                'order_code order_date_shipping order_payment_method order_amount_paid order_amount_due order_shipping_price order_shipping_address order_total_apply_discount order_status order_total_price order_products createdAt',
            ) // chọn thêm createdAt nếu cần
            .populate({
                path: 'order_products.productId',
                select: 'product_name product_thumb product_slug',
            })
            .sort({ createdAt: -1 }) // 🔥 Sắp xếp mới nhất trước
            .lean();

        return orders;
    }

    static async updateOrderStatus({ orderId, newStatus }) {
        if (!orderId) throw new RequestError('Không tìm thấy đơn hàng');

        const validStatuses = ['pending', 'confirm', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            throw new RequestError('Trạng thái không hợp lệ');
        }

        const updatedOrder = await OnlineOrder.findOneAndUpdate({ _id: orderId }, { order_status: newStatus, updatedAt: new Date() }, { new: true });

        if (!updatedOrder) throw new RequestError('Không tìm thấy đơn hàng');

        // Nếu đơn hàng đã giao thành công => Cập nhật bảng sản phẩm đã mua
        if (newStatus === 'delivered') {
            // thêm 1 lượt quay cho user
            const user = await userModel.findById(updatedOrder.order_user);
            user.user_spin_turns = (user.user_spin_turns || 0) + 1;
            await user.save();
            const orderItems = updatedOrder.order_products;
            for (const item of orderItems) {
                const { productId, quantity } = item;
                const existingProduct = await PurchasedModel.findOne({
                    pc_userId: updatedOrder.order_user,
                    pc_productId: productId,
                });
                if (existingProduct) {
                    existingProduct.pc_quantity += quantity;
                    existingProduct.pc_isReviewed = false;
                    await existingProduct.save();
                } else {
                    await PurchasedModel.create({
                        pc_userId: updatedOrder.order_user,
                        pc_productId: productId,
                        pc_quantity: quantity,
                        pc_purchaseDate: new Date(),
                    });
                }
            }
        }
        return updatedOrder;
    }

    static async getAllOrders({ status }) {
        const fillter = {};
        if (status) fillter.order_status = status;
        const orders = await OnlineOrder.find(fillter)
            .select(
                'order_code order_shipping_address order_amount_due order_amount_paid order_payment_method order_total_apply_discount order_status order_total_price order_products createdAt',
            ) // chọn thêm createdAt nếu cần
            .populate({
                path: 'order_products.productId',
                select: 'product_name product_thumb product_slug',
            })
            .sort({ createdAt: -1 }) // 🔥 Sắp xếp mới nhất trước
            .lean();

        return orders;
    }

    static async getOrder(orderId) {
        if (!orderId) throw new RequestError('Không tìm thấy đơn hàng');
        const order = await OnlineOrder.findById(orderId)
            .populate('order_user', 'user_name')
            .populate('order_products.productId', '_id product_name product_thumb product_slug'); // Populate productId with only product_thumb
        if (!order) throw new RequestError('Không tìm thấy đơn hàng');

        return order;
    }
    // Tìm đơn hàng theo order_code
    static async getOrderByCode(code) {
        try {
            const order = await OnlineOrder.findOne({ order_code: code }).populate('order_products.productId');

            if (!order) {
                throw new Error('Order not found');
            }

            return order;
        } catch (error) {
            throw error;
        }
    }

    static async getOfflineOrderByCode(code) {
        const order = await OfflineOrder.findOne({ order_code: code }).populate('order_products.productId').populate('order_staff', 'name email'); // Nếu muốn hiện thông tin nhân viên tạo đơn

        return order;
    }

    static async cancelOrder({ userId, orderId, address }) {
        if (!userId || !orderId) {
            throw new RequestError('Thiếu thông tin bắt buộc');
        }

        const order = await OnlineOrder.findOne({ _id: orderId, order_user: userId });
        if (!order) {
            throw new RequestError(`Đơn hàng không tồn tại`);
        }

        let refundedAmount = 0;

        // Xử lý hoàn tiền nếu đã thanh toán trước
        if (order.order_amount_paid > 0) {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new RequestError(`Người dùng không tồn tại`);
            }

            // Hoàn lại số tiền đã trả bằng số dư hoặc VNPAY (tuỳ loại)
            refundedAmount = order.order_amount_paid;
            user.user_balance += refundedAmount;
            await user.save();
        }

        if (address) {
            order.order_shipping_address = address;
        }
        // Đánh dấu đã hoàn tiền và huỷ đơn
        order.order_refunded = true;
        order.order_status = 'cancelled';

        // Khôi phục số lượng sản phẩm
        await Promise.all(
            order.order_products.map((item) =>
                Product.findByIdAndUpdate(item.productId, {
                    $inc: {
                        product_quantity: +item.quantity,
                        product_sold: -item.quantity,
                    },
                }),
            ),
        );

        await order.save();

        return {
            message: `Đã huỷ đơn hàng và hoàn tiền ${refundedAmount.toLocaleString()} đ`,
            refundedAmount,
            paymentMethod: order.order_payment_method,
        };
    }
    static async reorder({ userId, orderId }) {
        // Kiểm tra đầu vào
        if (!userId || !orderId) {
            throw new RequestError('Thiếu thông tin userId hoặc orderId');
        }

        // Tìm đơn hàng đã huỷ
        const cancelledOrder = await OnlineOrder.findOne({
            _id: orderId,
            order_user: userId,
            order_status: 'cancelled',
        });

        if (!cancelledOrder) {
            throw new RequestError('Đơn hàng không tồn tại hoặc không phải đơn hàng đã hủy');
        }

        // Kiểm tra người dùng
        const user = await userModel.findById(userId);
        if (!user) {
            throw new RequestError('Người dùng không tồn tại');
        }

        // Cập nhật phương thức thanh toán (giả định đặt lại là thanh toán khi nhận hàng)
        cancelledOrder.order_payment_method = 'CASH';

        // Kiểm tra và cập nhật tồn kho sản phẩm
        const productUpdates = cancelledOrder.order_products.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new RequestError(`Sản phẩm ${item.productId} không tồn tại`);
            }
            if (product.product_quantity < item.quantity) {
                throw new RequestError(`Sản phẩm ${product.product_name} không đủ số lượng tồn kho`);
            }

            // Trừ số lượng tồn và cộng số lượng đã bán
            await Product.findByIdAndUpdate(item.productId, {
                $inc: {
                    product_quantity: -item.quantity,
                    product_sold: item.quantity,
                },
            });
        });

        await Promise.all(productUpdates);

        // Xử lý thời gian giao hàng dự kiến
        const shipping = await shippingCompany.findById(cancelledOrder.order_shipping_company);
        if (!shipping) {
            throw new RequestError('Không tìm thấy công ty vận chuyển');
        }

        const now = Date.now();
        cancelledOrder.order_date_shipping = {
            from: new Date(now + shipping.sc_delivery_time.from * 24 * 60 * 60 * 1000),
            to: new Date(now + shipping.sc_delivery_time.to * 24 * 60 * 60 * 1000),
        };

        // Cập nhật trạng thái và thông tin thanh toán
        cancelledOrder.order_status = 'pending';
        cancelledOrder.order_amount_paid = 0;
        cancelledOrder.order_amount_due = cancelledOrder.order_total_price + cancelledOrder.order_shipping_price;

        // Lưu lại đơn hàng
        await cancelledOrder.save();

        // Trả về thông tin đơn hàng cho controller
        return {
            paymentMethod: cancelledOrder.order_payment_method,
            totalOrderPrice: cancelledOrder.order_total_price,
        };
    }
}

module.exports = OrderService;
