// controllers/ProductController.js
const Product = require("../models/Product");
const User = require("../models/User");
const { validationResult } = require("express-validator");

class productController {
  static async createProduct(req, res) {
		try{
			const result = validationResult(req);
			if (!result.isEmpty()) {
				return res.status(400).json({ errors: result.array() });
			}
			const user = await User.findById(req.user.userId).exec();
			if (!user) {
				return res.status(404).json({ error: "User not found" });
			} else if (user.role !== "admin" || user.role !== "seller") {
				return res.status(403).json({ error: "Access denied" });
			}
			const product = new Product(req.body);
			product.sellerId = user._id;
			await product.save();
			res.status(201).json({ message: "Product created successfully", product });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
  }

  static async getAllProducts(req, res) {
		const limit = parseInt(req.query.limit) || 10;
		const page = parseInt(req.query.page) || 1;
		const skip = (page - 1) * limit;

		try{
			const products = await Product.find()
			.limit(limit)
			.skip(skip)
			.exec();
			res.status(200).json({ products });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
  }

	static async getProductById(req, res) {
		try{
			const product = await Product.findById(req.params.ProductId);
			if (!product) {
				return res.status(404).json({ error: "Product not found" });
			}
			res.status(200).json({ product });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	static async updateProduct(req, res) {
		try{
			const user = await User.findById(req.user.userId).exec();
			if (!user || user.role !== "admin" || user.role !== "seller") {
				return res.status(403).json({ error: "Access denied" });
			}
			const result = validationResult(req);
			if (!result.isEmpty()) {
				return res.status(400).json({ errors: result.array() });
			}
			const product = await Product.findById(req.params.ProductId);
			if (!product) {
				return res.status(404).json({ error: "Product not found" });
			}
			Object.assign(product, req.body);
			await product.save();
			res.status(200).json({ message: "Product updated successfully", product });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	static async deleteProduct(req, res) {
		const user = await User.findById(req.user.userId).exec();
		if (!user || user.role !== "admin" || user.role !== "seller") {
			return res.status(403).json({ error: "Access denied" });
		}

		try{
			const product = await Product.findById(req.params.ProductId);
			if (!product) {
				return res.status(404).json({ error: "Product not found" });
			}
			await product.remove();
			res.status(200).json({ message: "Product deleted successfully" });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Internal server error" });
		}
		return res.status(204).json({ message: "Product deleted successfully" });
	}
}

module.exports = productController;