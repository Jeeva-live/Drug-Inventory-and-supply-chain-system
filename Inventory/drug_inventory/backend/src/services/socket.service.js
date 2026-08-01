const socketIo = require('socket.io');

let io;

exports.init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // Adjust for production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected: ' + socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected: ' + socket.id);
        });
    });

    return io;
};

exports.getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
