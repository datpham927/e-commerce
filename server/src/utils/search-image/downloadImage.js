const fs = require("fs").promises;
const axios = require("axios");

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
module.exports = downloadImage