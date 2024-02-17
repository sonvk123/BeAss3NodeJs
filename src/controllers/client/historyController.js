const mongoose = require("mongoose");

const userModel = require("../../models/userModels");
const orderModel = require("../../models/orderModels");

const ProductModel = require("../../models/productModels");

let url =
  process.env.NODE_ENV === "production"
    ? "https://beass3nodejs.onrender.com"
    : "http://localhost:5000";

// lấy History
exports.getHistory = async (req, res) => {
  const { count, page, idUser } = req.query;
  // count: số lượng đơn hàng trong mỗi trang
  // page: trang hiện tại
  // idUser: ID của người dùng

  const pageSize = +count;
  const currentPage = +page;

  try {
    const user = await userModel.findById(idUser);
    const orderIds = user.order;
    const orders = await orderModel.find({ _id: { $in: orderIds } });

    // Tính toán vị trí đầu và cuối của trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const totalRecords = orders.length; // Tổng số bản ghi
    const totalPages = Math.ceil(totalRecords / pageSize); // Tổng số trang

    // Lấy dữ liệu cho trang hiện tại
    const currentPageData = orders.slice(startIndex, endIndex);

    let historySend = [];
    currentPageData.forEach((order) => {
      const history = {
        _id: order._id,
        idUser: idUser,
        fullname: order.fullname,
        phone: order.phone,
        address: order.address,
        total: order.cart.total,
        delivery: true,
        status: true,
      };
      historySend.push(history);
    });

    const data_send = {
      totalPages: totalPages,
      currentPageData: historySend,
    };

    res.send(data_send);
  } catch (error) {

    res.status(500).send({ message: "Lỗi server khi lấy lịch sử đơn hàng" });
  }

// lấy History theo id
exports.getDetail = async (req, res) => {
  console.log("getDetail");
  const orderId = req.params.id;
  const order = await orderModel.findById(orderId);

  order.cart.items.map((item) => {
    if (item.img.includes("firebasestorage")) {
      item.img = item.img;
    } else {
      item.img = `${url}/${item.img}`;
    }
  });
  console.log("order.cart.items:", order.cart.items);
  res.send(order);
};
