// socket/socket.js
const { Server } = require('socket.io');
const { addUser, removeUser, getUserById, getOnlineUsers } = require('./users');
const { addAdmin, removeAdmin, getAdminById, getOnlineAdmins } = require('./admins');

let io;

const createSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.URL_CLIENT,
        },
    });

    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);
        // === Khi user kết nối ===
        socket.on('addUser', (userId) => {
            if (userId) {
                addUser(userId, socket.id);
            }
            io.emit('getUserOnline', getOnlineUsers());
        });
        // === Khi admin kết nối ===
        socket.on('addAdmin', (adminId) => {
            if (adminId) {
                addAdmin(adminId, socket.id);
            }
            io.emit('getAdminOnline', getOnlineAdmins());
        });
        // === Gửi thông báo đến người dùng cụ thể ===
        socket.on('sendNotificationToUser', (data) => {
            const user = getUserById(data.userId);
            if (user) {
                socket.to(user.socketId).emit('getNotificationUser', data, (ack) => {
                    console.log(ack ? `✅ Message sent to socket ${user.socketId}` : `❌ Failed to send message to socket ${user.socketId}`);
                });
            }
        });
        // === Gửi tin nhắn đến người dùng ===
        socket.on('sendMessage', (data) => {
            const user = getUserById(data.receiver);
            if (user) {
                socket.to(user.socketId).emit('getMessage', data, (ack) => {
                    console.log(ack ? `✅ Message sent to socket ${user.socketId}` : `❌ Failed to send message to socket ${user.socketId}`);
                });
            }
        });

        // === Gửi tin nhắn đến admin ===
        socket.on('sendMessageForAdminOnline', async (data) => {
            if (getOnlineAdmins().length === 0) return;
            console.log('📨 Gửi tin nhắn đến các admin online...');
            const sendPromises = getOnlineAdmins().map(
                (admin) =>
                    new Promise((resolve) => {
                        socket.to(admin.socketId).emit('getMessageByAdmin', data, (ack) => {
                            if (ack) {
                                resolve(`✅ Sent to admin ${admin.socketId}`);
                            } else {
                                resolve(`❌ Failed to send to admin ${admin.socketId}`);
                            }
                        });
                    }),
            );
            const results = await Promise.all(sendPromises);
            results.forEach((result) => console.log(result));
        });

        socket.on('sendNotificationForAdminOnline', async (data) => {
            if (getOnlineAdmins().length === 0) return;
            console.log('📨 Gửi tin nhắn đến các admin online...');
            const sendPromises = getOnlineAdmins().map(
                (admin) =>
                    new Promise((resolve) => {
                        socket.to(admin.socketId).emit('getNotificationByAdmin', data, (ack) => {
                            if (ack) {
                                resolve(`✅ Sent to admin ${admin.socketId}`);
                            } else {
                                resolve(`❌ Failed to send to admin ${admin.socketId}`);
                            }
                        });
                    }),
            );
            const results = await Promise.all(sendPromises);
            results.forEach((result) => console.log(result));
        });
        // === Ngắt kết nối ===
        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
            removeUser(socket.id);
            removeAdmin(socket.id);
            io.emit('getUserOnline', getOnlineUsers());
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io chưa được khởi tạo!');
    }
    return io;
};

module.exports = { createSocket, getIO };
