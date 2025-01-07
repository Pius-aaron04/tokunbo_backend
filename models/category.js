// models/category.js

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
	parentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: false
	},
});

module.exports = new mongoose.model("Category", categorySchema);
