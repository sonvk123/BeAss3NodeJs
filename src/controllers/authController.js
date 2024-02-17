const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

const User = require("../models/userModels");

const sessionModel = require("../models/sessionModel");

// khi đăng nhập
exports.postLogin = async (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;

  try {
    // lấy dữ liệu user theo email
    const user = await User.findOne({ email: email });
    if (!user) {
      const data = {
        errorMessage: "Sai tài khoản hoặc mật khẩu !!!",
        validationErrors: errors.array(),
      };
      return res.status(422).send(data);
    }

    // kiếm tra xem password có đúng không
    const doMatch = await bcrypt.compare(password, user.password);
    // nếu đúng thì lấy data user để truyền xuống client
    if (doMatch) {
      const userSend = {
        _id: user._id,
        email: user.email,
        name_user: user.fullName,
        cart: user.cart,
        isAdmin: user.isAdmin,
        roomId: user.session,
        isLogin: true,
      };
      // tạo cookie
      res.cookie("user", userSend, {
        httpOnly: true,
      });
      return res
        .status(200)
        .send({ message: "Đăng nhập thành công !!", user: userSend });
    }
    const data = {
      errorMessage: "Sai tài khoản hoặc mật khẩu !!!",
      validationErrors: [],
    };
    return res.status(422).send(data);
  } catch (err) {
    console.log(err);
    // Xử lý lỗi, có thể sử dụng next(err) để chuyển lỗi đến middleware xử lý lỗi chung (nếu có).
    return res.status(500).send({ errorMessage: "Lỗi server" });
  }
};

// khi đăng nhập admin
exports.postLoginAdmin = async (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;

  try {
    // lấy dữ liệu user theo email
    const user = await User.findOne({ email: email });
    if (!user) {
      const data = {
        errorMessage: "Sai tài khoản hoặc mật khẩu !!!",
        oldInput: {
          email: email,
          password: password,
        },
      };
      return res.status(422).send(data);
    }

    // kiếm tra xem password có đúng không
    const doMatch = await bcrypt.compare(password, user.password);
    // nếu đúng thì lấy data admin để truyền xuống client
    if (doMatch) {
      if (user.isAdmin === "admin" || user.isAdmin === "Counselors") {
        const userSend = {
          _id: user._id,
          email: user.email,
          name_user: user.fullName,
          cart: user.cart,
          isAdmin: user.isAdmin,
          isLogin: true,
        };
        // tạo cookie
        res.cookie("user", userSend, {
          httpOnly: true,
        });
        return res
          .status(200)
          .send({ message: "Đăng nhập thành công !!", user: userSend });
      } else {
        return res.status(422).send({
          message:
            "Đăng nhập thất bại, phải đăng nhập bằng tài khoản admin hoặc Counselors !!",
        });
      }
    } else {
      const data = {
        errorMessage: "Sai tài khoản hoặc mật khẩu !!!",
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      };
      return res.status(422).send(data);
    }
  } catch (err) {
    console.log(err);
    // Xử lý lỗi, có thể sử dụng next(err) để chuyển lỗi đến middleware xử lý lỗi chung (nếu có).
    return res.status(500).send({ errorMessage: "Lỗi server" });
  }
};

// khi đăng xuất
exports.getlogout = async (req, res) => {
  console.log("khi đăng xuất");
  res.clearCookie("user").send("Đã xóa cookie thành công");
};

// khi đăng ký
exports.postSignup = async (req, res, next) => {
  try {
    const fullName = req.query.fullName;
    const email = req.query.email;
    const password = req.query.password;
    const phone = req.query.phone;
    const isAdmin = req.query.isAdmin ? req.query.isAdmin : "Client";
    const errors = validationResult(req);

    console.log("errors:", errors.isEmpty());

    if (!errors.isEmpty()) {
      console.log("errors.array():", errors.array());
      const data = {
        errorMessage: errors.array()[0].msg,
        oldInput: {
          fullName: fullName,
          email: email,
          password: password,
          phone: phone,
          isAdmin: isAdmin,
        },
        validationErrors: errors.array(),
      };
      console.log("data:", data);
      return res.status(422).send(data);
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log("hashedPassword:", hashedPassword);

      const session = await sessionModel.create({
        userId: null,
        sessionData: [],
      });

      const user = await User.create({
        fullName: fullName,
        email: email,
        phoneNumber: phone,
        password: hashedPassword,
        isAdmin: isAdmin,
        cart: { items: [] },
        session: session._id,
      });

      session.userId = user._id;
      session.save();
      console.log("user:", user);
      // return res.status(200).send({ user });
      return res.status(200).send("gửi thành công");
    }
  } catch (error) {
    console.error("Error creating session or user:", error);
    const err = new Error("Internal Server Error");
    err.status = 500;
    return next(err);
  }
};

// lấy user theo Id
exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  const user = await User.findById({ _id: userId });
  console.log("user:", user);
};
