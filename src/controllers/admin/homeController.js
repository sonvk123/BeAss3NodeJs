const productModel = require("../../models/productModels");

exports.getProducts = async (req, res) => {
  const name = req.query.name;
  const userCookie = req.cookies.user;
  let products;
  if (userCookie && userCookie.isAdmin === "admin") {
    console.log("userCookie.isAdmin:", userCookie.isAdmin);
    if (!name) {
      // Nếu không có tên được cung cấp, lấy tất cả sản phẩm
      products = await productModel.find();
    } else {
      // Nếu có tên, lọc sản phẩm theo tên
      products = await productModel.find({
        name: { $regex: new RegExp(name, "i") },
      });
    }
    res
      .status(200)
      .send({
        messgae: "Lấy dữ liệu thành công !",
        products,
      });
  } else {
    products = [];
    console.log("Phải là admin mới có thể truy cập vào trang này !");
    res.status(200).send({
      messgae: "Phải là admin mới có thể truy cập vào trang này !",
      products,
    });
  }
};

