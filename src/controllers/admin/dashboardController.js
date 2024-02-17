const mongoose = require("mongoose");

const userModels = require("../../models/userModels");
const ProductModel = require("../../models/productModels");
const orderModels = require("../../models/orderModels");

// lấy dashboard
exports.getdashboard = async (req, res) => {
  const { count, page } = req.query;
  // count : số lượng trong 1 trang
  // page : trang hiện tại
  // search : tên tìm kiếm

  const pageSize = +req.query.count;
  const currentPage = +req.query.page;

  const users = await userModels.find({ isAdmin: "Client" });
  const client = users.length;

  // Tính toán vị trí đầu và cuối của trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const orders = await orderModels.find();
  let total_revenue = 0;
  orders.map((value) => {
    total_revenue += value.cart.total;
  });
  const transaction_number = orders.length;

  let historys = [];
  orders.map((order) => {
    const history = {
      _id: order._id,
      idUser: order.userId,
      fullname: order.fullname,
      phone: order.phone,
      address: order.address,
      total: order.cart.total,
      delivery: true,
      status: true,
    };
    historys.push(history);
  });

  const totalRecords = historys.length; // Tổng số bản ghi

  const totalPages = Math.ceil(totalRecords / pageSize); // Tổng số trang

  // Lấy dữ liệu cho trang hiện tại
  const currentPageData = historys.slice(startIndex, endIndex);

  const data_send = {
    client,
    total_revenue,
    transaction_number,
    historys: currentPageData,
    totalPages: totalPages,
  };
  res.status(200).send(data_send);
};

// xem chi tiểt 1 order
exports.getDetail = async (req, res) => {
  const { idProduct, idUser, count } = req.query;
  const user = await userModels.findById(idUser);
  const product = await ProductModel.findById(idProduct);
};
