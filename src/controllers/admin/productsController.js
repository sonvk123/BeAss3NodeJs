const productModels = require("../../models/productModels");

// lấy danh sách products và theo thên
exports.getPagination = async (req, res) => {
  try {
    const { count, page, search } = req.query;
    // count : số lượng trong 1 trang
    // page : trang hiện tại
    // search : tên tìm kiếm

    const pageSize = +req.query.count;
    const currentPage = +req.query.page;

    let products;
    if (!search) {
      products = await productModels.find();
    } else {
      products = await productModels.find({
        name: { $regex: new RegExp(search, "i") },
      });
    }

    // Tính toán vị trí đầu và cuối của trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const totalRecords = products.length; // Tổng số bản ghi

    const totalPages = Math.ceil(totalRecords / pageSize); // Tổng số trang

    // KHI DELOY
    let url = "https://ass3-nodejs-q5t8.onrender.com";
    // KHI DEV
    // let url = "http://localhost:5000";

    let newProducts = [];
    products.map((product) => {
      const updatedImages = [];
      for (let i = 1; i <= 4; i++) {
        const imageUrl = product[`img${i}`];
        if (imageUrl.includes("firebasestorage")) {
          updatedImages.push(imageUrl);
        } else {
          updatedImages.push(`${url}/${imageUrl}`);
        }
      }
      const NewProduct = {
        _id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        short_desc: product.short_desc,
        long_desc: product.long_desc,
        quantity: product.quantity,
        Images: updatedImages,
      };
      newProducts.push(NewProduct);
    });

    const data_send = {
      totalPages: totalPages,
      currentPageData: newProducts,
    };

    res.status(200).json(data_send);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// xem chi tiết 1 product
exports.getDetail = async (req, res) => {
  const productId = req.params.productId;
  const product = await productModels.findById(productId);
  res.status(200).send({ message: "lấy dữ liệu thành công", product });
};

// thêm product
exports.postAddProduct = async (req, res) => {
  const { Category, Price, LongDes, ShortDes, Name, Quantity } = req.body;
  const Images = req.files;

  const newProduct = await productModels.create({
    category: Category,
    img1: Images[0].path,
    img2: Images[1].path,
    img3: Images[2].path,
    img4: Images[3].path,
    long_desc: LongDes,
    short_desc: ShortDes,
    name: Name,
    price: Price,
    quantity: Quantity,
  });

  res.status(200).send("message : Thêm sản phẩm thành công !!!");
};

// cập nhật product
exports.putUpdateProduct = async (req, res) => {
  const { _id, Category, LongDes, ShortDes, Name, Price, Quantity } = req.body;
  const query = { _id: _id };
  const newProduct = {
    $set: {
      name: Name,
      category: Category,
      long_desc: LongDes,
      short_desc: ShortDes,
      price: Price,
      quantity: Quantity,
    },
  };
  await productModels.updateOne(query, newProduct);
  const product = await productModels.findById(_id);
  res.status(200).send("message : Cập nhật sản phẩm thành công !!!");
};

// xóa product
exports.getDeleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    // Sử dụng phương thức remove hoặc deleteOne của Model để xóa sản phẩm theo id
    const result = await productModels.deleteOne({ _id: productId });

    if (result.deletedCount === 1) {
      // Nếu sản phẩm được xóa thành công, trả về phản hồi thành công
      return res
        .status(200)
        .send({ message: "Sản phẩm đã được xóa thành công" });
    } else {
      // Nếu không tìm thấy sản phẩm với id tương ứng, trả về phản hồi lỗi
      return res.status(404).send({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error(error);
    return res.status(500).send({ message: "Lỗi server" });
  }
};
