const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cartRoutes = require("./public/js/routes/cartRoutes.js");

// Khởi tạo ứng dụng
const app = express();

const config = {
  PORT: 5000,
  MONGODB_URI:
    "mongodb+srv://Thaingo:Thaingo25@cluster0.j83xa.mongodb.net/tfwar?retryWrites=true&w=majority",
  JWT_SECRET: "your_strong_jwt_secret_key_here",
};

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/cart", cartRoutes);
app.use(express.static(path.join(__dirname, "public")));

// Kết nối MongoDB với các tùy chọn mới hơn
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware tự động cập nhật updatedAt trước khi lưu
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

// API Routes

// Đăng ký tài khoản
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password, newsletterSubscribed } = req.body;

    // Kiểm tra user tồn tại
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists",
      });
    }

    // Tạo user mới (password sẽ tự động được hash bởi pre-save hook)
    const user = await User.create({
      username,
      email,
      password,
      newsletterSubscribed,
    });

    // Tạo token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      redirect: "/main.html",
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Xử lý lỗi validation của Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

// Đăng nhập
app.post("/api/auth/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Tìm user bằng email hoặc username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Tạo token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      redirect: "/main.html",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

// Middleware xác thực JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = user;
    next();
  });
}

// API bảo vệ cần xác thực
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user data",
    });
  }
});

// API lấy thông tin user
app.get("/api/users/:userId", authenticateToken, async (req, res) => {
  try {
    // Chỉ cho phép xem thông tin của chính mình
    if (req.params.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this profile",
      });
    }

    const user = await User.findById(req.params.userId).select(
      "-password -__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user data",
    });
  }
});

// API upload avatar (lưu vào MongoDB)
app.post("/api/users/upload-avatar", authenticateToken, async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) {
      return res
        .status(400)
        .json({ success: false, message: "No avatar uploaded" });
    }

    const avatar = req.files.avatar;
    const userId = req.body.userId;

    // Lưu file vào thư mục uploads (hoặc lên cloud storage)
    const uploadDir = path.join(__dirname, "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `avatar-${userId}-${Date.now()}${path.extname(
      avatar.name
    )}`;
    const filePath = path.join(uploadDir, fileName);

    await avatar.mv(filePath);

    // Lưu đường dẫn vào MongoDB
    const avatarUrl = `/uploads/${fileName}`;
    await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

    res.json({
      success: true,
      avatarUrl,
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to upload avatar" });
  }
});

// API cập nhật thông tin user
app.put("/api/users/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra user chỉ được cập nhật thông tin của chính mình
    if (userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this profile",
      });
    }

    const { fullName, bio, phone, company } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, phone, company },
      { new: true }
    ).select("-password -__v");

    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
});

const nodemailer = require("nodemailer");

// Cấu hình transporter Gmail (thêm ở đầu file server.js)
const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-gmail@gmail.com", // Thay bằng Gmail của bạn
    pass: "your-app-password", // Mật khẩu ứng dụng (không dùng mật khẩu chính)
  },
});

// API gửi liên hệ (cập nhật)
app.post("/api/contact", authenticateToken, async (req, res) => {
  try {
    const { userId, email, subject, message } = req.body;

    // 1. Lưu thông tin liên hệ vào MongoDB
    const contact = new Contact({
      userId,
      email,
      subject,
      message,
    });
    await contact.save();

    // 2. Gửi email thông báo
    const mailOptions = {
      from: `"TFWar Support" <your-gmail@gmail.com>`,
      to: "thaibap2406@gmail.com", // Email nhận
      subject: `[TFWar Contact] ${subject}`,
      text: `New contact from ${email}:\n\n${message}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // 3. Thực hiện gửi email
    await gmailTransporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Your message has been sent successfully",
    });
  } catch (error) {
    console.error("Contact error:", error);

    // Xử lý lỗi riêng cho phần gửi email
    if (error.code === "EAUTH") {
      return res.status(500).json({
        success: false,
        message: "Email authentication failed",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
});

// Phục vụ trang chính
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

// Xử lý 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// Khởi động server
app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
