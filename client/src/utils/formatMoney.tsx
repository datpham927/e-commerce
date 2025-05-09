export const formatMoney= (number: any )=>number?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
