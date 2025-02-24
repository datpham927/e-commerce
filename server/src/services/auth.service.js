"use strict";

const { BadRequestError } = require("../core/error.response");
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const redis = require("../config/redisClient");
const { findUserByEmail, findUserById } = require("../models/repositories/user.repo")
const { randomTokenByCrypto, hashTokenByCrypto } = require("../utils/tokenUtils");
const sendMail = require("../utils/sendMail");
const userModel = require("../models/user.model");
const createTokenPairs = require("../utils/auth/createTokenPairs");
const verifyRefreshToken = require("../utils/auth/verifyRefreshToken");

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

        // Gửi email chứa mã xác minh với giao diện đẹp hơn và tự căn chỉnh trên mọi thiết bị
        await sendMail({
            email,
            html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <tr>
                    <td align="center" style="padding-bottom: 20px;">
                        <h2 style="color: #333; margin: 0;">Xác Minh Email</h2>
                    </td>
                </tr>
                <tr>
                    <td style="color: #555; font-size: 16px; text-align: left;">
                        <p>Chào <b>${email.split("@")[0]}</b>,</p>
                        <p>Mã xác minh đăng ký tài khoản của bạn là:</p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <span style="background: #fff; color: #000; font-size: 24px; padding: 12px 24px; border: 2px solid #000; border-radius: 5px; display: inline-block; font-weight: bold;"> ${token}</span>

                    </td>
                </tr>
                <tr>
                    <td style="color: #555; font-size: 16px; text-align: left;">
                        <p>Mã này có hiệu lực trong vòng <b>5 phút</b>. Vui lòng không chia sẻ mã này với người khác.</p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding-top: 20px;">
                        <hr style="border: none; border-top: 1px solid #ddd; width: 100%;">
                        <p style="text-align: center; font-size: 14px; color: #888; margin-top: 10px;">
                            Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.
                        </p>
                    </td>
                </tr>
            </table>
        </div>`,
            fullName: email.split("@")[0]
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
    static async userSignup({ email, password, mobile }, res) {
        if (!email || !password) throw new BadRequestError("Vui lòng nhập đầy đủ thông tin");
        const redisKey = `verify_email:${email}`;
        const holderUser = await findUserByEmail(email)
        if (holderUser) { throw new BadRequestError("Tài khoản đã tồn tại", 201) }
        const existingData = await redis.hgetall(redisKey);
        if (!existingData?.confirmed) throw new BadRequestError("Vui lòng xác minh tài khoản trước khi đăng ký");
        const passwordHash = await bcrypt.hashSync(password, 10)
        // create new shop
        const newUser = await userModel.create({
            user_name: email?.split("@")[0],
            user_email: email,
            user_mobile: mobile,
            user_password: passwordHash
        })
        if (!newUser) {
            throw new BadRequestError("Đăng ký không thành công!", 403)
        }
        const tokens = await createTokenPairs(newUser.toObject())
        const { accessToken, refreshToken } = tokens
        res.cookie("refresh_token", `${refreshToken}`, {
            httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return accessToken

    }
    static async userLogin({ email, password }, res) {
        const foundUser = await findUserByEmail(email)
        if (!foundUser) {
            throw new BadRequestError("Tài khoản không tồn tại", 403)
        }
        const matchPassword = bcrypt.compareSync(password, foundUser.user_password)
        if (!matchPassword) throw new BadRequestError("Tài khoản hoặc mật khẩu không đúng", 201)
        const tokens = await createTokenPairs(foundUser)
        const { accessToken, refreshToken } = tokens
        res.cookie("refresh_token", `${refreshToken}`, {
            httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return accessToken
    }
    static async userLogout(res) {
        res.clearCookie("refresh_token")
    }
    static async handleRefreshToken(refreshToken, res) {
        if (!refreshToken) throw new BadRequestError("Cookie required", 201)
        const response = verifyRefreshToken(refreshToken)
        if (!response) throw new BadRequestError("Verification failed", 201)
        const foundUser = await findUserById(response._id)
        const tokens = await createTokenPairs(foundUser)
        res.cookie("refresh_token", `${tokens.refreshToken}`, {
            httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return tokens.accessToken
    }

    // Gửi mã quên mật khẩu
    static async forgotPassword({ email }) {
        if (!email) throw new BadRequestError("Vui lòng cung cấp email");

        const user = await findUserByEmail(email);
        if (!user) throw new BadRequestError("Tài khoản không tồn tại", 404);

        const redisKey = `reset_password:${email}`;
        const token = randomTokenByCrypto(6);
        const hashToken = hashTokenByCrypto(token);
        const expiresAt = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

        await redis.hset(redisKey, {
            token: hashToken,
            expiresAt: expiresAt.toString(),
            confirmed: "false",
        });
        await redis.expire(redisKey, 10 * 60);

        // Gửi email với mã đặt lại mật khẩu
        await sendMail({
            email,
            html: `
            <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" 
                    style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #333; margin: 0;">Yêu Cầu Đặt Lại Mật Khẩu</h2>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="color: #555; font-size: 16px; text-align: left;">
                            <p>Chào <b>${email.split("@")[0]}</b>,</p>
                            <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã sau để xác nhận:</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <span style="background: #fff; color: #000; font-size: 24px; padding: 12px 24px; border: 2px solid #000; border-radius: 5px; display: inline-block; font-weight: bold;"> ${token}</span>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="color: #555; font-size: 16px; text-align: left;">
                            <p>Mã này có hiệu lực trong vòng <b>10 phút</b>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding-top: 20px;">
                            <hr style="border: none; border-top: 1px solid #ddd; width: 100%;">
                            <p style="text-align: center; font-size: 14px; color: #888; margin-top: 10px;">
                                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                            </p>
                        </td>
                    </tr>
                </table>
            </div>`,
            fullName: email.split("@")[0],
        });

        return { success: true, message: "Mã xác nhận đã được gửi qua email" };
    }

    // Xác nhận mã quên mật khẩu
    static async verifyResetCode({ email, token }) {
        if (!email || !token) throw new BadRequestError("Vui lòng cung cấp đầy đủ thông tin");

        const redisKey = `reset_password:${email}`;
        const existingData = await redis.hgetall(redisKey);
        if (!existingData?.token) throw new BadRequestError("Mã xác nhận không hợp lệ", 400);
        if (Date.now() > parseInt(existingData.expiresAt, 10)) {
            throw new BadRequestError("Mã xác nhận đã hết hạn", 400);
        }
        const hashToken = hashTokenByCrypto(token);
        if (hashToken !== existingData.token) throw new BadRequestError("Mã xác nhận không đúng", 400);
        // Xác nhận thành công -> cập nhật trạng thái mã
        await redis.hset(redisKey, "confirmed", "true");

        return { success: true, message: "Xác nhận thành công, bạn có thể đặt lại mật khẩu" };
    }

    // Đổi mật khẩu mới
    static async resetPassword({ email, newPassword }) {
        if (!email || !newPassword) {
            throw new BadRequestError("Vui lòng cung cấp đầy đủ thông tin");
        }

        const redisKey = `reset_password:${email}`;
        const existingData = await redis.hgetall(redisKey);
        if (!existingData?.confirmed || existingData.confirmed !== "true") {
            throw new BadRequestError("Bạn chưa xác nhận mã đặt lại mật khẩu", 400);
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await userModel.updateOne({ user_email: email }, { user_password: passwordHash });

        await redis.del(redisKey); // Xóa mã sau khi dùng

        return { success: true, message: "Mật khẩu đã được đặt lại thành công" };
    }
}

module.exports = UserAuthService;