const mongoose = require("mongoose");

const userModel = require("../../models/userModels");
const orderModel = require("../../models/orderModels");

const ProductModel = require("../../models/productModels");

// lấy History
exports.getHistory = async (req, res) => {
  const { count, page } = req.query;
  // count : số lượng trong 1 trang
  // page : trang hiện tại
  // search : tên tìm kiếm

  const pageSize = +req.query.count;
  const currentPage = +req.query.page;

  const userId = req.query.idUser;
  const user = await userModel.findById(userId);
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
  currentPageData.map((order) => {
    const history = {
      _id: order._id,
      idUser: userId,
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
};

// lấy History theo id
exports.getDetail = async (req, res) => {
  console.log("getDetail");
  const orderId = req.params.id;
  const order = await orderModel.findById(orderId);
  // KHI DELOY
  let url = "https://ass3-nodejs-q5t8.onrender.com";
  // KHI DEV
  // let url = "http://localhost:5000";

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
