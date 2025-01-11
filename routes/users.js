// routes/user.js
const { Router } = require("express");
const { authenticateUser } = require("../utils/auth_helpers");
const UserController = require("../controllers/UserController");
const { body } = require("express-validator");

const userRouter = Router();

// Profile endpoints
userRouter.get("/me", authenticateUser, UserController.getMe); // Get logged-in user profile
userRouter.put("/me/update_profile", authenticateUser, UserController.updateMe); // Update profile
userRouter.delete("/me", authenticateUser, UserController.deleteMe); // Delete profile

// Order endpoints
userRouter.get("/me/orders", authenticateUser, UserController.getOrders); // Get logged-in user orders history
// Wishlist
userRouter.get("/me/wishlist", authenticateUser, UserController.getWishlist); // Fetch wishlist
userRouter.post("/me/wishlist", authenticateUser, UserController.addToWishlist); // Add/Update wishlist
userRouter.delete(
  "/me/wishlist",
  authenticateUser,
  UserController.removeFromWishlist
); // Remove from wishlist

// Cart
userRouter.get("/me/cart", authenticateUser, UserController.getCart); // Fetch cart
userRouter.post(
  "/me/cart",
  authenticateUser,
  [body("productId").isMongoId(), body("quantity").isNumeric()],
  UserController.addToCart
); // Add to cart
userRouter.delete("/me/cart", authenticateUser, UserController.removeFromCart); // Remove from cart

module.exports = userRouter;
