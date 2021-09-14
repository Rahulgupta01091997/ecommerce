const express = require('express')

const cartController = require("../controller/cart");
const router = express.Router();

router.get("/cart", cartController.cartPage);
router.post("/cart", cartController.addToCart);
router.post("/updateCartQuantity",cartController.updateCartQuantity);
router.post("/delcart", cartController.deleteFromCart);
router.get("/checkout", cartController.checkoutPage);

module.exports = router;