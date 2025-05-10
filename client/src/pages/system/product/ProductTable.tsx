import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IProduct } from '../../../interfaces/product.interfaces';
import { formatMoney } from '../../../utils/formatMoney';
import { QRCodeCanvas } from 'qrcode.react';
import QRCode from 'qrcode';
import { useRef } from 'react';
import dayjs from 'dayjs';

interface ProductListProps {
    products: IProduct[];
    onEdit: (product: IProduct) => void;
    onDelete: (id: string) => void;
}

const ProductTable: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
    const qrRef = useRef<HTMLCanvasElement>(null);

    const downloadQR = async (code: string, name: string) => {
        try {
            const url = await QRCode.toDataURL(code, { scale: 10, margin: 2 });
            const link = document.createElement('a');
            link.href = url;
            link.download = `${name}.png`;
            link.click();
        } catch (error) {
            console.error('Lỗi tạo QR:', error);
        }
    };

    const getExpiryColor = (expiryDate: string) => {
        const now = dayjs();
        const expiry = dayjs(expiryDate);
        const diffDays = expiry.diff(now, 'day');
        if (diffDays < 0) return 'bg-red-100 text-red-600';
        if (diffDays <= 30) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const getStockColor = (quantity: number) => {
        if (quantity > 50) return 'bg-green-100 text-green-600';
        if (quantity >= 1) return 'bg-yellow-100 text-yellow-600';
        return 'bg-red-100 text-red-600';
    };

    return (
        <div className="overflow-hidden rounded-xl my-6 border border-gray-200 bg-white shadow-md dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 text-left text-gray-500 text-sm font-semibold dark:text-gray-400">QR Code</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-left text-gray-500 text-sm font-semibold dark:text-gray-400">Tên sản phẩm</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-left text-gray-500 text-sm font-semibold dark:text-gray-400">Tồn kho</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-left text-gray-500 text-sm font-semibold dark:text-gray-400">Đã bán</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-left text-gray-500 text-sm font-semibold dark:text-gray-400">Đơn giá</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-left text-gray-500 text-sm font-semibold dark:text-gray-400">Giảm giá</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-left text-gray-500 text-sm font-semibold dark:text-gray-400">Hạn sử dụng</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-center text-gray-500 text-sm font-semibold dark:text-gray-400">Thao tác</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {products?.map((product) => (
                            <TableRow key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 py-3">
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => downloadQR(product.product_code, product.product_name)}>
                                        <QRCodeCanvas value={product.product_code} size={40} ref={qrRef} />
                                        <DownloadOutlinedIcon className="text-green-600 hover:text-green-800 transition" />
                                    </div>
                                </TableCell>

                                <TableCell className="px-5 py-3 text-gray-800 dark:text-white/90">
                                    <span className="line-clamp-2 text-sm font-medium">{product.product_name}</span>
                                </TableCell>

                                <TableCell className="px-5 py-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStockColor(product.product_quantity)}`}>
                                        {product.product_quantity}
                                    </span>
                                </TableCell>

                                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                                    {product.product_sold}
                                </TableCell>

                                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                                    {formatMoney(product.product_price)}
                                </TableCell>

                                <TableCell className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">
                                    {product.product_discount}%
                                </TableCell>

                                <TableCell className="px-5 py-3 text-sm">
                                    {product.product_expiry_date ? (
                                        <span className={`px-3 py-1 rounded-full font-medium ${getExpiryColor(product.product_expiry_date)}`}>
                                            {dayjs(product.product_expiry_date).format('DD/MM/YYYY')}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">Không có</span>
                                    )}
                                </TableCell>

                                <TableCell className="px-5 py-3 flex justify-center gap-3">
                                    <button onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700 transition">
                                        <EditIcon />
                                    </button>
                                    <button onClick={() => onDelete(product._id)} className="text-red-500 hover:text-red-700 transition">
                                        <DeleteIcon />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ProductTable;
