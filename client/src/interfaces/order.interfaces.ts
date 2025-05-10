export interface Product {
    _id: string;
    product_name: string;
    product_slug: string;
    product_thumb: string;
}

export interface OrderProduct {
    _id: string;
    productId: Product;
    quantity: number;
    price: number;
    discount: number;
    product_thumb?: string;
}

export interface IOrder {
    _id: string;
    order_products: OrderProduct[];
    order_total_price: number;
    order_total_apply_discount: number;
    order_amount_paid: number; // Số tiền đã trả
    order_amount_due: number; // Thêm trường số tiền cần trả
    order_status: 'pending' | 'confirm' | 'shipped' | 'delivered' | 'cancelled';
    order_code: string;
    order_shipping_address: {
        fullName: string;
        detailAddress: string;
        village: string;
        district: string;
        city: string;
        phone: string;
    };
    order_shipping_price: number;
    order_payment_method: string;
    order_date_shipping: {
        from: Date;
        to: Date;
    };
    order_staff?: {
        _id: string;
        admin_name: string;
        admin_mobile: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
