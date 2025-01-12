// controllers/UserController.js

const User = require("../models/user");
const { validationResult } = require("express-validator");
const { sanitizeUser } = require("./AuthController");
const Order = require("../models/order").orderModel;
const Cart = require("../models/order").cartModel;
const Product = require("../models/product");

class UserController {
  static async getMe(req, res) {
    const user = await User.findById(req.user.userId).exec();
    const payload = sanitizeUser(user.toObject());
    res.status(200).json({ payload });
  }
  static async updateMe(req, res) {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Restrict updates to certain fields
      const restrictedFields = [
        "password",
        "isVerified",
        "emailVerified",
        "phoneVerified",
        "ninVerified",
      ];
      if (Object.keys(req.body).some((key) => restrictedFields.includes(key))) {
        return res
          .status(400)
          .json({ error: "You cannot update these fields directly" });
      }

      // Find user by ID
      const user = await User.findById(req.user.userId).exec();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update allowed fields
      Object.assign(user, req.body);
      await user.save();

      // Respond with success
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the profile" });
    }
  }

  static async deleteMe(req, res) {
    const user = await User.findById(req.user.userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    try {
      await user.deleteOne({ _id: req.user.userId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "User deleted successfully" });
  }

  static async getOrders(req, res) {
    const user = await User.findById(req.user.userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: user._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({ orders });
  }

  static async getWishlist(req, res) {
    const user = await User.findById(req.user.userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const wishList = user.wishList;
    res.status(200).json({ wishlist });
  }

  static async addToWishlist(req, res) {
    const user = await User.findById(req.user.userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const product = await Product.findById(req.body.productId).exec();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    user.wishList.push(product._id);
    await user.save();
    res.status(200).json({ message: "Product added to wishlist" });
  }

  static async removeFromWishlist(req, res) {
    const user = await User.findById(req.user.userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const product = await Product.findById(req.body.productId).exec();
    if (!product || !user.wishList.includes(product._id)) {
      return res.status(404).json({ error: "Product not found" });
    }
    user.wishList = user.wishList.filter(
      (p) => p.toString() !== product._id.toString()
    );
    await user.save();
    res.status(200).json({ message: "Product removed from wishlist" });
  }

  static async getCart(req, res) {
    const user = await User.findById(req.user.userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    res.status(200).json({ cart });
  }

  static async addToCart(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const user = await User.findById(req.user.userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const product = await Product.findById(req.body.productId).exec();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    let cart = await Cart.findOne({ user: user._id }).exec();
    if (!cart) {
      cart = new Cart({ user: user._id });
    }
    cart.products.push({
      productId: req.body.productId,
      quantity: req.body.quantity,
    });
    await cart.save();
    res.status(200).json({ message: "Product added to cart" });
  }

  static async removeFromCart(req, res) {
    const user = await User.findById(req.user.userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const product = await Product.findById(req.body.productId).exec();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    let cart = await Cart.findOne({ user: user._id }).exec();
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== product._id.toString()
    );
    await cart.save();
    res.status(200).json({ message: "Product removed from cart" });
  }
}

module.exports = UserController;
