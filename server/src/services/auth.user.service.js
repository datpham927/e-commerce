'use strict';

const { RequestError } = require('../core/error.response');
const bcrypt = require('bcrypt');
const axios = require('axios');
const crypto = require('crypto');
const redis = require('../config/redisClient');
const { findUserByEmail, findUserById } = require('../models/repositories/user.repo');
const { hashTokenByCrypto, randomNumberToken } = require('../utils/tokenUtils');
const sendMail = require('../utils/sendMail');
const userModel = require('../models/user.model');
const createTokenPairs = require('../utils/auth/createTokenPairs');
const verifyRefreshToken = require('../utils/auth/verifyRefreshToken');

class AuthUserService {
    // gửi mã xác thực
    static async sendVerificationEmail({ email }) {
        if (!email) throw new RequestError('Vui lòng cung cấp email');
        const user = await findUserByEmail(email);
        if (user) throw new RequestError('Tài khoản đã tồn tại', 200);

        const redisKey = `verify_email:${email}`;
        const existingData = await redis.hgetall(redisKey);
        const currentTime = Date.now();

        if (existingData?.token) {
            const lastSentAt = parseInt(existingData.lastSentAt || '0', 10);
            if (currentTime - lastSentAt < 30 * 1000) {
                throw new RequestError('Bạn gửi quá nhanh, vui lòng đợi 30 giây trước khi thử lại.');
            }
        }

        // Tạo token mới hoặc cập nhật token
        const token = randomNumberToken(6);
        const hashToken = hashTokenByCrypto(token);
        const expiresAt = currentTime + 5 * 60 * 1000; // Giữ nguyên thời gian hết hạn nếu còn hiệu lực
        const lastSentAt = currentTime; // Cập nhật thời điểm gửi cuối cùng

        // Cập nhật lại Redis
        await redis.hset(redisKey, {
            token: hashToken,
            confirmed: 'false',
            expiresAt: expiresAt.toString(),
            lastSentAt: lastSentAt.toString(),
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
                        <p>Chào <b>${email.split('@')[0]}</b>,</p>
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
            fullName: email.split('@')[0],
        });

        return { success: true, message: 'Sent successful' };
    }

    // thực hiện xác thực
    static async confirmVerificationEmail({ token, email }) {
        if (!token || !email) throw new RequestError('Vui lòng cung cấp thông tin xác thực');
        //tìm email đang đăng ký, nếu có thì đem ra so sánh
        const redisKey = `verify_email:${email}`;
        // Lấy dữ liệu từ Redis
        const existingData = await redis.hgetall(redisKey);
        if (existingData.expiresAt < Date.now()) throw new RequestError('Mã xác nhận đã hết hạn');
        const hashToken = hashTokenByCrypto(token);
        if (hashToken !== existingData?.token) throw new RequestError('Mã xác nhận không đúng');
        await redis.hset(redisKey, 'confirmed', 'false');
    }
    // xác thực thành công -> đăng ký
    static async userSignup({ email, password, mobile }, res) {
        if (!email || !password) throw new RequestError('Vui lòng nhập đầy đủ thông tin');
        const redisKey = `verify_email:${email}`;
        const holderUser = await findUserByEmail(email);
        if (holderUser) {
            throw new RequestError('Tài khoản đã tồn tại', 201);
        }
        const existingData = await redis.hgetall(redisKey);
        if (!existingData?.confirmed) throw new RequestError('Vui lòng xác minh tài khoản trước khi đăng ký');
        const passwordHash = bcrypt.hashSync(password, 10);
        // create new shop
        const newUser = await userModel.create({
            user_name: email?.split('@')[0],
            user_email: email,
            user_password: passwordHash,
        });
        if (!newUser) {
            throw new RequestError('Đăng ký không thành công!', 403);
        }
        const tokens = await createTokenPairs(newUser.toObject());
        const { accessToken, refreshToken } = tokens;
        res.cookie('refresh_token', `${refreshToken}`, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return {
            accessToken,
            user: newUser,
        };
    }
    static async userLogin({ email, password }, res) {
        const foundUser = await userModel.findOne({ user_email: email }).lean();
        if (!foundUser) {
            throw new RequestError('Tài khoản không tồn tại', 203);
        }
        if (foundUser.user_isBlocked) {
            throw new RequestError('Tài khoản đã bị chặn', 203);
        }
        const matchPassword = bcrypt.compareSync(password, foundUser.user_password);
        if (!matchPassword) throw new RequestError('Tài khoản hoặc mật khẩu không đúng', 201);
        const tokens = await createTokenPairs(foundUser);
        const { accessToken, refreshToken } = tokens;
        res.cookie('refresh_token', `${refreshToken}`, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return {
            accessToken,
            user: foundUser,
        };
    }

    static async loginGoogle(credential, res) {
        const googleUser = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        const { email, name, picture, googleId } = googleUser.data;
        // Tìm người dùng theo email
        let user = await userModel.findOne({ user_email: email });

        if (!user) {
            user = await userModel.create({
                user_email: email,
                user_name: name,
                user_avatar_url: picture,
                user_googleId: googleId,
            });
        } else if (!user.user_googleId) {
            user.user_googleId = googleId;
            await user.save();
        }

        // Chuyển user về dạng plain object
        const userObject = user.toObject();

        // Tạo JWT token từ plain object
        const tokens = await createTokenPairs(userObject);
        const { accessToken, refreshToken } = tokens;

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken,
            user: userObject,
        };
    }

    static async userLogout(res) {
        res.clearCookie('refresh_token');
    }
    static async handleRefreshToken(refreshToken, res) {
        if (!refreshToken) throw new RequestError('Cookie required', 201);
        const response = verifyRefreshToken(refreshToken);
        if (!response) throw new RequestError('Verification failed', 201);
        const foundUser = await findUserById(response._id);
        const tokens = await createTokenPairs(foundUser);
        res.cookie('refresh_token', `${tokens.refreshToken}`, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return tokens.accessToken;
    }

    // Gửi mã quên mật khẩu
    static async forgotPassword({ email }) {
        if (!email) throw new RequestError('Vui lòng cung cấp email');
        const user = await userModel.findOne({ user_email: email });
        if (!user) throw new RequestError('Tài khoản không tồn tại', 404);
        if (user.user_isBlocked) throw new RequestError('Tài khoản đã bị chặn', 403);
        const token = randomNumberToken(30);
        const hashToken = hashTokenByCrypto(token);
        const expiresAt = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút
        user.user_passwordResetToken = hashToken;
        user.user_passwordTokenExpires = expiresAt;
        await user.save();
        // Gửi email với mã đặt lại mật khẩu
        await sendMail({
            email: email,
            subject: 'Đặt Lại Mật Khẩu Tài Khoản',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Đặt Lại Mật Khẩu</h2>
                <p style="color: #555; line-height: 1.6;">
                    Kính chào ${user.user_name || email?.split('@')[0]},<br><br>
                    Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản <strong>${email}</strong>. 
                    Vui lòng nhấp vào liên kết bên dưới để tiến hành thay đổi mật khẩu. 
                    Liên kết này có hiệu lực trong vòng <strong>10 phút</strong>:
                </p>
                <a 
                    href="${process.env.URL_CLIENT}/reset_password/${token}" 
                    style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0;"
                >
                    Đặt Lại Mật Khẩu
                </a>
                <p style="color: #555; line-height: 1.6;">
                    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi ngay.
                </p>
                <p style="color: #555; line-height: 1.6;">
                    Trân trọng,<br>
                    Đội ngũ hỗ trợ
                </p>
            </div>
        `,
            fullName: user.user_name,
        });
    }

    // Đổi mật khẩu mới
    static async resetPassword({ token, password }) {
        // Kiểm tra đầu vào
        if (!token || !password) {
            return { success: false, message: 'Yêu cầu phải có token và mật khẩu' };
        }
        // Mã hóa token
        const hashToken = crypto.createHash('sha256').update(token).digest('hex');
        // Tìm người dùng với token hợp lệ và chưa hết hạn
        const user = await userModel.findOne({
            user_passwordResetToken: hashToken,
            user_passwordTokenExpires: { $gt: Date.now() },
        });
        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            throw new RequestError('Token không hợp lệ hoặc đã hết hạn');
        }
        // Cập nhật mật khẩu và xóa token đặt lại
        user.user_password = bcrypt.hashSync(password, 10);
        user.user_passwordResetToken = null;
        user.user_passwordTokenExpires = null;
        // Lưu thông tin người dùng
        await user.save();
    }
    //đổi mk khi đã đăng nhập
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await userModel.findById(userId);
        if (!user) throw new RequestError('Người dùng không tồn tại');
        // Kiểm tra mật khẩu hiện tại
        const matchPassword = bcrypt.compareSync(currentPassword, user.user_password);
        if (!matchPassword) throw new RequestError('Mật khẩu hiện tại không đúng');
        // Kiểm tra mật khẩu mới có giống với mật khẩu cũ không
        const isSameAsOldPassword = bcrypt.compareSync(newPassword, user.user_password);
        if (isSameAsOldPassword) {
            throw new RequestError('Mật khẩu mới không thể giống mật khẩu cũ');
        }
        // Mã hóa mật khẩu mới và cập nhật vào cơ sở dữ liệu
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user.user_password = newPasswordHash;
        // Cập nhật thời gian thay đổi mật khẩu
        user.user_passwordChangedAt = new Date().toISOString();
        await user.save();
    }
}

module.exports = AuthUserService;
