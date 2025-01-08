// models/category.js

const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
	slug: {
		type: String,
		slug: "title",
		unique: true
	},
	parentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: false
	},
});

module.exports = new mongoose.model("Category", categorySchema);
