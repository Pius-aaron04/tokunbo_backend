// controllers/UserController.js

const User = require("../models/user");
const { validationResult } = require("express-validator");
const { sanitizeUser } = require("./AuthController");

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
		try{
			await user.deleteOne({_id: req.user.userId});
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: err.message });
		}
		res.status(200).json({ message: "User deleted successfully" });
  }
}

module.exports = UserController;
