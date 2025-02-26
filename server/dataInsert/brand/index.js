const mongoose = require('mongoose');
const brandModel = require("../../src/models/brand.model");
const brandData = require("./brand.json")
require("dotenv").config();

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

// Hàm chèn dữ liệu
const insertBrands = async () => {
    try {
        console.log("Inserting brands...");
        const result = await brandModel.insertMany(brandData);
        console.log("✅ Inserted brands:", result);
    } catch (error) {
        console.error("❌ Insert failed:", error.message);
    } finally {
        mongoose.connection.close(); // Đóng kết nối sau khi xong
    }
};

// Chạy chương trình
const start = async () => {
    await connectDB();  // Kết nối DB trước
    await insertBrands(); // Sau đó chèn dữ liệu
};

start();
