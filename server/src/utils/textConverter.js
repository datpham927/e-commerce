'use strict';

const formatDate = require('./formatDate');

module.exports = {
    convertOrderToText: (orders = []) => {
        if (!Array.isArray(orders)) return '';
        return orders
            .map((order, index) => {
                const productsText = order.order_products
                    ?.map(
                        (item, idx) => `
              sản phẩm ${idx + 1}
              - Tên sản phẩm: ${item.productId?.product_name || 'Chưa có tên'}
              - Số lượng: ${item.quantity || 0}
              - Giá: ${item.price || 0}
              - Giảm giá: ${item.discount || 0}
              - URL Hình ảnh: ${item.productId?.product_thumb || 'Chưa có ảnh'}
              - URL Liên kết sản phẩm: /${item.productId?.product_slug}/${item.productId?._id || '#'}
            `,
                    )
                    .join('');
                return `
          Đơn hàng của người dùng đang hỏi ${index + 1}: 
            
          - Danh sách sản phẩm: ${productsText || 'Chưa có sản phẩm'}
          - Địa chỉ: ${order.order_shipping_address?.detailAddress || 'Chưa có địa chỉ'}
          - Phí giao hàng: ${order.order_shipping_price || 0}
          - Thời gian vận chuyển: từ ${formatDate(order.order_date_shipping?.from) || 'N/A'} đến ${formatDate(order.order_date_shipping?.to) || 'N/A'} ngày
          - Trạng thái đơn hàng: ${order.order_status || 'N/A'}
          - URL Liên kết đơn hàng: /nguoi-dung/don-hang    
          - Ngày đặt: ${formatDate(order.updateAt)}
          - mã sản phẩm: ${order.order_code || 'Chưa có tên'}
          `;
            })
            .join('');
    },

    /**
     * Chuyển đổi danh sách sản phẩm thành văn bản
     * @param {Array} products - Danh sách sản phẩm từ productModel
     * @returns {string} Chuỗi văn bản mô tả sản phẩm
     */
    convertProductsToText(products = []) {
        if (!Array.isArray(products)) return '';
        return products
            .map((p, index) => {
                const {
                    product_name,
                    product_sold,
                    product_ratings,
                    product_discount,
                    product_thumb,
                    product_description,
                    product_slug,
                    _id,
                    product_attribute,
                } = p;

                // Xử lý các thuộc tính sản phẩm
                const attributesText =
                    Array.isArray(product_attribute) && product_attribute.length > 0
                        ? product_attribute.map((attr) => `  - ${attr.name}: ${attr.value}`).join('\n')
                        : '  - Không có thuộc tính nào';
                return `
Sản phẩm ${index + 1}:
- Tên sản phẩm: ${product_name || 'Chưa có tên'}
- Lượt bán: ${product_sold || 0}
- Đánh giá sao: ${product_ratings || 'Chưa có đánh giá'}
- Giảm giá: ${product_discount || 0}%
- URL Hình ảnh: ${product_thumb || 'Chưa có ảnh'}
- Mô tả: ${product_description || 'Chưa có mô tả'}
- URL Liên kết sản phẩm: /${product_slug || '#'}/${_id || '#'}
- Thuộc tính sản phẩm:
${attributesText}
`;
            })
            .join('');
    },
    /**
     * Chuyển đổi danh sách danh mục thành văn bản
     * @param {Array} categories - Danh sách danh mục từ categoryModel
     * @returns {string} Chuỗi văn bản mô tả danh mục
     */
    convertCategoryToText: (categories = []) => {
        if (!Array.isArray(categories)) return '';

        return categories
            .map(
                (c, index) => `
          Danh mục sản phẩm ${index + 1}:
          - Tên: ${c.category_name || 'Chưa có tên'}
          - URL Hình ảnh: ${c.category_thumb || 'Chưa có ảnh'}
          - URL Liên kết: /danh-muc/${c.category_slug || '#'}/${c.category_code || '#'}
        `,
            )
            .join('');
    },

    /**
     * Chuyển đổi danh sách thương hiệu thành văn bản
     * @param {Array} brands - Danh sách thương hiệu từ brandModel
     * @returns {string} Chuỗi văn bản mô tả thương hiệu
     */
    convertBrandToText: (brands = []) => {
        if (!Array.isArray(brands)) return '';

        return brands
            .map(
                (b, index) => `
          Thương hiệu sản phẩm ${index + 1}:
          - Tên: ${b.brand_name || 'Chưa có tên'}
          - URL Hình ảnh: ${b.brand_thumb || 'Chưa có ảnh'}
          - URL Liên kết: /thuong-hieu/${b.brand_slug || '#'}/${b._id || '#'}
        `,
            )
            .join('');
    },

    /**
     * Chuyển đổi danh sách công ty vận chuyển thành văn bản
     * @param {Array} shippings - Danh sách công ty vận chuyển từ shippingCompanyModel
     * @returns {string} Chuỗi văn bản mô tả công ty vận chuyển
     */
    convertShippingToText: (shippings = []) => {
        if (!Array.isArray(shippings)) return '';
        return shippings
            .map(
                (s, index) => `
          Công ty vận chuyển ${index + 1}:
          - Tên: ${s.sc_name || 'Chưa có tên'}
          - Địa chỉ: ${s.sc_address || 'Chưa có địa chỉ'}
          - Giá giao hàng: ${s.sc_shipping_price || 0}
          - Thời gian vận chuyển đơn hàng: từ ${s.sc_shipping_time?.from} đến ${s.sc_shipping_time?.to} ngày
        `,
            )
            .join('');
    },
};
