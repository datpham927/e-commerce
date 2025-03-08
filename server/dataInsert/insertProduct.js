// insert products data
const Bo_qua_tang = require("./product/Bo-qua-tang.json")
const Cham_soc_thu_cung = require("./product/Cham-soc-thu-cung.json")
const DJo_An_Vat = require("./product/DJo-An-Vat.json")
const DJau_andamp_Hat_Cac_Loai = require("./product/DJau-andamp-Hat-Cac-Loai.json")
const DJo_Uong_Khong_Con = require("./product/DJo-Uong-Khong-Con.json")
const DJo_uong_Pha_che_dang_bot = require("./product/DJo-uong-Pha-che-dang-bot.json")
const DJo_uong_co_con = require("./product/DJo-uong-co-con.json")
const Gia_Vi_va_Che_Bien = require("./product/Gia-Vi-va-Che-Bien.json")
const Sua_va_cac_San_pham_tu_sua = require("./product/Sua-va-cac-San-pham-tu-sua.json")
const Thuc_pham_DJong_hop_va_Kho = require("./product/Thuc-pham-DJong-hop-va-Kho.json")
const data = [
    // Bo_qua_tang,
    Cham_soc_thu_cung, DJo_An_Vat,
    DJo_Uong_Khong_Con, DJo_uong_Pha_che_dang_bot,
    DJo_uong_co_con, Gia_Vi_va_Che_Bien,
    Sua_va_cac_San_pham_tu_sua, Thuc_pham_DJong_hop_va_Kho,
    DJau_andamp_Hat_Cac_Loai
]
const mongoose = require('mongoose');
const convertArrToObject = require("./convertArrToObject")
const categories = require("./category")
const mobilenet = require("@tensorflow-models/mobilenet");
const tf = require("@tensorflow/tfjs"); // Sử dụng phiên bản Web
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

const axios = require("axios");
const categoryModel = require("../src/models/category.model")
const brandModel = require("../src/models/brand.model")
const productModel = require("../src/models/product.model")

const IMAGE_SIZE = 224; // Kích thước chuẩn cho MobileNet
/** Tải ảnh từ URL và lưu vào thư mục tạm */
async function downloadImage(url, filePath) {
    const modifiedUrl = url.replace(/\.(JPG)$/, ".jpg");
    const retries = 3;

    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(modifiedUrl, { responseType: "arraybuffer" });
            await fs.writeFile(filePath, response.data);
            console.log(`✅ Đã tải ảnh: ${modifiedUrl}`);
            return true; // Thoát khỏi hàm nếu tải thành công
        } catch (error) {
            console.error(`❌ Lỗi tải ảnh ${modifiedUrl} (lần thử ${i + 1}):`, error);
            if (i === retries - 1) {
                throw error; // Nếu hết số lần thử, ném lỗi
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 2 giây trước khi thử lại
        }
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
// Hàm kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://11111111:dn2yTO8JJTXY8rev@cluster0.nto34.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1); // Dừng chương trình nếu lỗi
    }
};

const upsertCategory = async ({ category_name, category_thumb }) => {
    let category = await categoryModel.findOne({ category_name });
    if (!category) {
        category = await categoryModel.create({ category_name, category_thumb });
        await categoryModell.save();
    }
    console.log("Dữ liệu danh mục:", category);
    return category;
}
const upsertBrand = async (brand_name) => {
    let brand = await brandModel.findOne({ brand_name });
    if (!brand) {
        brand = await brandModel.create({ brand_name });
    } else {
        await brand.save();
    }
    return brand;
}
const insertProductsData = async () => {
    await connectDB();
    try {
        let errors = [];
        const BATCH_SIZE = 5; // Limit concurrent processing

        // Helper function to process items in batches
        const processBatch = async (items) => {
            return Promise.all(
                items.map(async (item) => {
                    let tempPath; // Declare tempPath here so it's accessible in finally
                    try {
                        const brand = await upsertBrand(item.brand);
                        const images = item?.images?.map(i =>
                            i.split(",")[0].replace("100x100", "750x750")
                        ).filter(e =>
                            !e.includes('w100') && !e.includes("upload") && !e.includes("w1080")
                        ) || [];

                        const image_url = item.image?.split(",")[0];
                        const randomFileName = `temp_search_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.JPG`;
                        tempPath = path.join(__dirname, "img", randomFileName); // Assign here

                        if (!(await downloadImage(image_url, tempPath))) {
                            errors.push(`Image download failed: ${image_url}`);
                            return null;
                        }

                        const searchFeatures = await extractFeatures(tempPath);
                        const featuresArray = Array.from(searchFeatures.dataSync());
                        searchFeatures.dispose();

                        if (featuresArray.length == 0) {
                            return null
                        }

                        return await productModel.create({
                            product_name: item.title,
                            product_thumb: image_url,
                            product_images: images.filter((_, i) => i !== 0),
                            product_discount: item.discount || 15,
                            product_price: item.oldPrice ? parseInt(item.oldPrice.replace(".", "")) : 150000,
                            product_description: item.description.join(", "),
                            product_quantity: 1000,
                            product_attribute: convertArrToObject(item.detail),
                            product_sold: item.solid ? parseInt(item.solid.replace(".", "")) : 0,
                            product_views: 10,
                            product_image_features: featuresArray,
                            product_category_id: item.category_id,
                            product_brand_id: brand._id
                        });
                    } catch (error) {
                        errors.push(`Product error: ${item.title} - ${error.message}`);
                        return null;
                    }
                })
            );
        };
        const responses = [];
        for (let i = 0; i < data.length; i++) {
            const category = await upsertCategory(categories[i]);
            console.log("category", category);

            const products = data[i];
            for (let j = 0; j < products.length; j += BATCH_SIZE) {
                const batch = products.slice(j, j + BATCH_SIZE).map(item => ({
                    ...item,
                    category_id: category._id
                }));
                const batchResults = await processBatch(batch);
                responses.push(...batchResults);
            }
        }

        console.error("Operation failed:", responses);

    } catch (error) {
        console.error("Operation failed:", error);
    }
};
insertProductsData()

