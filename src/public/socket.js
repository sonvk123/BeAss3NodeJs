let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          "https://feadminass3nodejs.onrender.com",
          "https://feclientass3nodejs.onrender.com",
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      },
    });
    console.log("Socket Io đã khởi tạo !");
    return io;
  },
  getIO: () => {
    if (!io) {
      console.log("Socket Io khởi tạo thất bại!");
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
