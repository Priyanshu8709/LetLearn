const mailSender = require("../utils/mailSender");
const { otpTemplate, welcomeTemplate, passwordChangedTemplate } = require("../utils/emailTemplates");
const user = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Generate a unique 6-digit numeric OTP
        let otp = OtpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let existing = await Otp.findOne({ otp });
        while (existing) {
            otp = OtpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            existing = await Otp.findOne({ otp });
        }

        // Hash and store
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
        await Otp.create({ email, otp: hashedOtp });

        // Send the plain OTP to the user's email
        await mailSender(email, "Your LetLearn OTP Code", otpTemplate(otp));

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ message: "Cannot send OTP, please try again" });
    }
};

exports.signUp = async (req, res) => {
    try {
        const { firstname, lastname, email, password, otp, accountType } = req.body;

        if (!firstname || !lastname || !email || !password || !otp || !accountType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Verify OTP — compare the plain OTP sent by user against the stored hash
        const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        if (!recentOtp) {
            return res.status(400).json({ message: "OTP not found. Please request a new OTP." });
        }
        const isValidOtp = await bcrypt.compare(otp, recentOtp.otp);
        if (!isValidOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const Profile = require("../models/Profile");
        const profileDetails = await Profile.create({
            gender: null, DoB: null, about: null, contactNumber: null, address: null,
        });

        const newUser = await user.create({
            firstname, lastname, email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            courses: [],
            images: `https://api.dicebear.com/10.x/dylan/svg?seed=${firstname}`,
            courseProgress: [],
        });

        // Welcome email (fire and forget — don't block signup on email failure)
        mailSender(email, "Welcome to LetLearn! 🎉", welcomeTemplate(firstname)).catch((err) =>
            console.error("Welcome email failed:", err.message)
        );

        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({ message: "Cannot sign up, please try again" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }

        if (existingUser.isBlocked) {
            return res.status(403).json({ message: "Your account has been blocked. Contact support." });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const payload = {
            id: existingUser._id,
            email: existingUser.email,
            role: existingUser.accountType,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" });

        existingUser.password = undefined;

        return res
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            })
            .status(200)
            .json({ message: "Logged in successfully", user: existingUser, token });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Cannot log in, please try again" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        existingUser.password = await bcrypt.hash(newPassword, salt);
        await existingUser.save();

        // Password change notification email
        mailSender(
            existingUser.email,
            "Your LetLearn password was changed",
            passwordChangedTemplate(existingUser.firstname)
        ).catch((err) => console.error("Password change email failed:", err.message));

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Error changing password:", err);
        return res.status(500).json({ message: "Cannot change password, please try again" });
    }
};
