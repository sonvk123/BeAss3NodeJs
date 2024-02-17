const ProductModel = require("../../models/productModels");

exports.getHomeProducts = async (req, res) => {
  const Products = await ProductModel.find();
  // console.log("Products:", Products);
  res.send({ message: "gửi dữ liệu thành công", products: Products });
};
