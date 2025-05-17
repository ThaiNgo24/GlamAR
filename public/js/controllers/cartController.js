const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Please login to add items to cart",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { productId, name, price, quantity, image } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, image });
    }

    await cart.save();

    res.json({
      success: true,
      cartCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    // Xử lý lỗi token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid or expired token",
      });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCartCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    const count =
      cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
