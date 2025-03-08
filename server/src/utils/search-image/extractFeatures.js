const tf = require("@tensorflow/tfjs"); // Sử dụng phiên bản Web
const mobilenet = require("@tensorflow-models/mobilenet");
const sharp = require("sharp");
const IMAGE_SIZE = 224; // Kích thước chuẩn cho MobileNet

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
module.exports = extractFeatures