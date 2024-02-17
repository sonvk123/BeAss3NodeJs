const usesrModel = require("../../models/userModels");
const sessionModel = require("../../models/sessionModel");

exports.getMessageByRoomId = async (req, res, next) => {
  const roomId = req.query.roomId;
  console.log("roomId:", roomId);
  const MessageByRoomId = await sessionModel.findById(roomId);
  res.status(200).send(MessageByRoomId);
};

exports.addMessage = async (req, res, next) => {
  const cookies = req.cookies;
  const { roomId, message, sender } = req.body;
  const messageNew = {
    sender: sender,
    message: message,
    timestamp: new Date(), // Thêm timestamp vào tin nhắn mới.
  };
  await sessionModel
    .findOneAndUpdate(
      { _id: roomId }, // Điều kiện tìm kiếm
      { $push: { sessionData: messageNew } }, // Thêm newMessage vào sessionData
      { new: true, upsert: true } // Tạo mới nếu không tìm thấy
    )
    .then((updatedSession) => {
      // Thực hiện các thao tác sau khi cập nhật thành công
      console.log("Session đã được cập nhật:");
      res.status(200).json(updatedSession); // Phản hồi với session đã được cập nhật
    })
    .catch((error) => {
      // Xử lý lỗi nếu cập nhật thất bại
      console.error("Lỗi khi cập nhật session:", error);
      res.status(500).json({ error: "Lỗi khi cập nhật session" }); // Phản hồi với lỗi
    });
};

exports.getAllRoom = async (req, res, next) => {
  const users = await usesrModel.find({ isAdmin: "Client" });
  res.status(200).send({ message: "lấy data thành công", data: users });
};
