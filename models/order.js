// models/order.js
// defines cart and order schemas

const mongoose = require("mongoose");
const Product = require("./product");

const cartSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	products: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
				min: 1,
			},
		},
	],
});



const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      set: (value) => value * 100,
      get: (value) => (value / 100).toFixed(2),
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
		address: {
			type: String,
			required: true
		},
		paymentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Payment",
			required: true
		}
  },
  { timestamps: true }
);

const orderModel =  mongoose.model("Order", orderSchema);
const cartModel = mongoose.model("Cart", cartSchema);

module.exports = { orderModel, cartModel };
