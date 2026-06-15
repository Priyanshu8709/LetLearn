const mailSender = require('../utils/mailSender');
const { passwordResetTemplate } = require('../utils/emailTemplates');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

exports.resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: "No account found with that email address" });
        }

        const token = crypto.randomUUID();
        const expires = Date.now() + 3600000; // 1 hour

        existingUser.token = token;
        existingUser.resetPasswordExpires = expires;
        await existingUser.save();

        const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/update?token=${token}`;

        await mailSender(
            email,
            "Reset your LetLearn password",
            passwordResetTemplate(existingUser.firstname, resetLink)
        );

        return res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (err) {
        console.error("Error sending reset email:", err);
        return res.status(500).json({ error: "Error sending password reset email" });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token and new password are required" });
        }

        const existingUser = await User.findOne({ token });
        if (!existingUser) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        if (existingUser.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ error: "Reset token has expired. Please request a new one." });
        }

        existingUser.password = await bcrypt.hash(newPassword, 10);
        existingUser.token = undefined;
        existingUser.resetPasswordExpires = undefined;
        await existingUser.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ error: "Error updating password" });
    }
};
