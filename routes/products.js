// routes/products.js

const productRouter = require("express").Router();
const authenticateUser = require("../utils/auth_helpers").authenticateUser;
const { body } = require("express-validator");
const ProductController = require("../controllers/ProductController");

productRouter.get("/", ProductController.getAllProducts);
productRouter.get("/:id", ProductController.getProductById);
productRouter.post(
  "/",
  authenticateUser,
  [
    body("name").isString().notEmpty(),
    body("description").isString().notEmpty(),
    body("price").isNumeric().notEmpty(),
    body("stockQuantity").isNumeric().notEmpty(),
    body("categoryId").isMongoId().notEmpty(),
    body("sellerId").isMongoId().notEmpty(),
  ],
  ProductController.createProduct
);
productRouter.put("/:id", authenticateUser, ProductController.updateProduct);
productRouter.delete("/:id", authenticateUser, ProductController.deleteProduct);
productRouter.get("/:id/reviews", ProductController.getProductReviews);

module.exports = productRouter;
