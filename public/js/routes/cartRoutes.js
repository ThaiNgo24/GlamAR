const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.get("/:userId", cartController.getCart);
router.get("/count/:userId", cartController.getCartCount);

module.exports = router;
