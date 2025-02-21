"use strict";

const { BadRequestError } = require("../core/error.response");
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const redis = require("../config/redisClient");
const { findUserByEmail } = require("../models/repositories/user.repo")
const { randomTokenByCrypto, hashTokenByCrypto } = require("../utils/tokenUtils");
const sendMail = require("../utils/sendMail");
const userModel = require("../models/user.model");
const createTokenPairs = require("../utils/auth/createTokenPairs");
const KeyTokenService = require("./keyToken.service");

class UserAuthService {
    // gửi mã xác thực 
    static async sendVerificationEmail({ email }) {
        if (!email) throw new BadRequestError("Vui lòng cung cấp email");
        const user = await findUserByEmail(email);
        if (user) throw new BadRequestError("Tài khoản đã tồn tại", 200);
        const redisKey = `verify_email:${email}`;
        const existingData = await redis.hgetall(redisKey);
        const currentTime = Date.now();
        if (existingData?.token) {
            const lastSentAt = parseInt(existingData.lastSentAt || "0", 10);
            if (currentTime - lastSentAt < 30 * 1000) {
                throw new BadRequestError("Bạn gửi quá nhanh, vui lòng đợi 30 giây trước khi thử lại.");
            }
        }
        // Tạo token mới hoặc cập nhật token
        const token = randomTokenByCrypto(3);
        const hashToken = hashTokenByCrypto(token);
        const expiresAt = existingData?.expiresAt || currentTime + 5 * 60 * 1000; // Giữ nguyên thời gian hết hạn nếu còn hiệu lực
        const lastSentAt = currentTime; // Cập nhật thời điểm gửi cuối cùng 
        // Cập nhật lại Redis
        await redis.hset(redisKey, {
            token: hashToken,
            confirmed: "false",
            expiresAt: expiresAt.toString(),
            lastSentAt: lastSentAt.toString()
        });
        await redis.expire(redisKey, 5 * 60); // Giữ thời gian hết hạn 5 phút
        // Gửi email chứa mã xác minh
        await sendMail({
            email,
            html: `<div>
                    <p>Mã xác minh đăng ký tài khoản của bạn là
                        <span style="color:blue;font-size:20px">${token}</span>
                        hiệu lực trong vòng 5 phút, không chia sẻ mã này với người khác. Xin cảm ơn!</p>
                   </div>`,
            fullName: email?.split("@")[0]
        });

        return { success: true, message: "Sent successful" };
    }
    // thực hiện xác thực 
    static async confirmVerificationEmail({ token, email }) {
        if (!token || !email) throw new BadRequestError("Vui lòng cung cấp thông tin xác thực");
        //tìm email đang đăng ký, nếu có thì đem ra so sánh 
        const redisKey = `verify_email:${email}`;
        // Lấy dữ liệu từ Redis
        const existingData = await redis.hgetall(redisKey);
        if (existingData.expiresAt < Date.now()) throw new BadRequestError("Mã xác nhận đã hết hạn")
        const hashToken = hashTokenByCrypto(token)
        if (hashToken !== existingData?.token) throw new BadRequestError("Mã xác nhận không đúng")
        await redis.hset(redisKey, "confirmed", "false");
    }
    // xác thực thành công -> đăng ký
    static async userSignup({ email, password, name }) {
        if (!email || !password || !name) throw new BadRequestError("Vui lòng nhập đầy đủ thông tin");
        const redisKey = `verify_email:${email}`;
        const holderUser = await findUserByEmail(email)
        if (holderUser) { throw new BadRequestError("Tài khoản đã tồn tại", 201) }
        const existingData = await redis.hgetall(redisKey);
        if (!existingData?.confirmed) throw new BadRequestError("Vui lòng xác minh tài khoản trước khi đăng ký");
        const passwordHash = await bcrypt.hashSync(password, 10)
        // create new shop
        const newUser = await userModel.create({
            user_name: name,
            user_email: email,
            user_password: passwordHash
        })
        if (!newUser) {
            throw new BadRequestError("Đăng ký không thành công!", 403)
        }
        const publicKey = crypto.randomBytes(100).toString('hex')
        const privateKey = crypto.randomBytes(100).toString('hex')
        // tạo ra key token và lưu vào database 
        // create accessToken and refreshToken
        const tokens = await createTokenPairs(newUser.toObject(), publicKey, privateKey)
        await KeyTokenService.createKeyToken({ userId: newUser._id, refreshToken: tokens.refreshToken, privateKey, publicKey })
        return tokens

    }
    static async userLogin({ email, password }) {
        const foundUser = await findUserByEmail(email)
        if (!foundUser) {
            throw new BadRequestError("Tài khoản không tồn tại", 403)
        }
        // kiểm tra password
        const matchPassword = bcrypt.compareSync(password, foundUser.user_password)
        if (!matchPassword) throw new BadRequestError("Tài khoản hoặc mật khẩu không đúng", 201)
        // render 2 key để lưu vào db và đăng ký token và refresh token
        const publicKey = crypto.randomBytes(100).toString('hex')
        const privateKey = crypto.randomBytes(100).toString('hex')
        // create accessToken and refreshToken and add to database
        const tokens = await createTokenPairs(foundUser, publicKey, privateKey)
        // thêm key vào db
        await KeyTokenService.createKeyToken({ userId: foundUser._id, refreshToken: tokens.refreshToken, privateKey, publicKey })
        return tokens
    }
}

module.exports = UserAuthService;
