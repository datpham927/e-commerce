// insert products data
const Bo_qua_tang = require("../../dataInsert/Bo-qua-tang.json")
const Cham_soc_thu_cung = require("../../dataInsert/Cham-soc-thu-cung.json")
const DJo_An_Vat = require("../../dataInsert/DJo-An-Vat.json")
const DJau_andamp_Hat_Cac_Loai = require("../../dataInsert/DJau-andamp-Hat-Cac-Loai.json")
const DJo_Uong_Khong_Con = require("../../dataInsert/DJo-Uong-Khong-Con.json")
const DJo_uong_Pha_che_dang_bot = require("../../dataInsert/DJo-uong-Pha-che-dang-bot.json")
const DJo_uong_co_con = require("../../dataInsert/DJo-uong-co-con.json")
const Gia_Vi_va_Che_Bien = require("../../dataInsert/Gia-Vi-va-Che-Bien.json")
const Sua_va_cac_San_pham_tu_sua = require("../../dataInsert/Sua-va-cac-San-pham-tu-sua.json")
const Thuc_pham_DJong_hop_va_Kho = require("../../dataInsert/Thuc-pham-DJong-hop-va-Kho.json")
const data = [Bo_qua_tang,
    Cham_soc_thu_cung, DJo_An_Vat,
    DJo_Uong_Khong_Con, DJo_uong_Pha_che_dang_bot,
    DJo_uong_co_con, Gia_Vi_va_Che_Bien,
    Sua_va_cac_San_pham_tu_sua, Thuc_pham_DJong_hop_va_Kho,
    DJau_andamp_Hat_Cac_Loai
]
const convertArrToObject = require("../ulits/convertArrToObject")
const { categories } = require("../ulits/const")
const mobilenet = require("@tensorflow-models/mobilenet");
const tf = require("@tensorflow/tfjs"); // Sử dụng phiên bản Web
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

const axios = require("axios");

const IMAGE_SIZE = 224; // Kích thước chuẩn cho MobileNet
/** Tải ảnh từ URL và lưu vào thư mục tạm */
async function downloadImage(url, filePath) {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        await fs.writeFile(filePath, response.data);
        console.log(`✅ Đã tải ảnh: ${url}`);
        return true;
    } catch (error) {
        console.error(`❌ Lỗi tải ảnh ${url}:`, error.message);
        return false;
    }
}
/** Xử lý ảnh bằng sharp và chuyển thành tensor */
async function preprocessImage(filePath) {
    const imageBuffer = await sharp(filePath)
        .resize(IMAGE_SIZE, IMAGE_SIZE) // Resize về 224x224
        .toFormat("png") // Chuyển thành PNG để tránh lỗi định dạng
        .removeAlpha() // Loại bỏ kênh Alpha (nếu có)
        .raw()
        .toBuffer(); // Xuất thành buffer thô

    const imageTensor = tf.tidy(() => {
        const uint8Array = new Uint8Array(imageBuffer);
        const tensor = tf.tensor3d(uint8Array, [IMAGE_SIZE, IMAGE_SIZE, 3], "int32");
        return tensor.expandDims(0).toFloat().div(255); // Chuẩn hóa về [0,1]
    });

    return imageTensor;
}
/** Trích xuất đặc trưng ảnh bằng MobileNet */
async function extractFeatures(filePath) {
    const imageTensor = await preprocessImage(filePath);
    const model = await mobilenet.load();
    const features = model.infer(imageTensor, "conv_preds"); // Trích xuất đặc trưng
    imageTensor.dispose(); // Giải phóng bộ nhớ
    return features;
}
const insertProductsData = async (req, res) => {
    try {
        let errors = []; // Mảng lưu lỗi
        const responses = await Promise.all(
            data.map(async (p, i) => {
                const category_name = categories[i].category;
                return Promise.all(
                    p.map(async (item, j) => {
                        try {
                            await User.findByIdAndUpdate(user[j % 3], { $inc: { totalProduct: +1 } });
                            const images = item?.images && item?.images
                                .map(i => i.split(",")[0].replace("100x100", "750x750"))
                                .filter(e => !e.includes('w100') && !e.includes("upload") && !e.includes("w1080"));

                            const image_url = item.image?.split(",")[0];
                            const randomFileName = `temp_search_${Date.now()}.png`;
                            const tempPath = path.join(__dirname, "testimg", randomFileName);

                            if (!(await downloadImage(image_url, tempPath))) {
                                errors.push(`Lỗi tải ảnh: ${image_url}`);
                                return null; // Bỏ qua sản phẩm này nhưng không dừng toàn bộ quá trình
                            }

                            const searchFeatures = await extractFeatures(tempPath);
                            const featuresArray = Array.from(searchFeatures.dataSync());
                            searchFeatures.dispose();
                            return await Product.create({
                                product_name: item.title,
                                product_thumb: image_url,
                                product_images: Array.from(images).filter((_, i) => i !== 0),
                                brand: item.brand,
                                discount: item.discount || 15,
                                description: item.description.join(", "),
                                product_quantity: 1000,
                                product_attribute: convertArrToObject(item.detail),
                                product_sold: item.solid ? item.solid.replace(".", "") : 0,
                                product_views: 10,
                                product_image_features: featuresArray,

                                category_name,
                            });
                        } catch (error) {
                            errors.push(`Lỗi sản phẩm: ${item.title} - ${error.message}`);
                            return null;
                        }
                    })
                );
            })
        );

        res.json({ success: true, data: responses.flat().filter(Boolean), errors });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = insertProductsData