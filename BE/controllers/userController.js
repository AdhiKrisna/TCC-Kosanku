import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize";
dotenv.config();

export async function register(req, res) {
    const { user_name, user_phone, user_email, user_password } = req.body;

    if (!user_name || !user_phone || !user_email || !user_password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // check if user email or phone already exists
    if (await UserModel.findOne({ where: { user_email } })) {
        return res.status(409).json({ message: "Email already exists" });
    }
    if (await UserModel.findOne({ where: { user_phone } })) {
        return res.status(409).json({ message: "Phone number already exists" });
    }

    try {
        const hashedPassword = await bcrypt.hash(user_password, 10);
        const newUser = await UserModel.create({
            user_name,
            user_phone,
            user_email,
            user_password: hashedPassword
        });
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: newUser
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: error.message });
    }
}

export async function login(req, res) {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await UserModel.findOne({ where: { user_email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //check credentials
        const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // if credentials are valid, 
        const userPlain = user.toJSON();
        console.log("user :", userPlain);

        // copy semua data user ke object baru, tapi yang aman aja
        const { user_password: _, refresh_token: __, ...safeUserData } = userPlain;
        console.log("safe user data:", safeUserData);

        // create access token (expired in 5 minutes)
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessToken = jwt.sign(
            safeUserData,
            accessTokenSecret,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
            safeUserData,
            refreshTokenSecret,
            { expiresIn: "1d" }
        );

        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        //masukin refresh token ke database
        await UserModel.update(
            { refresh_token: refreshToken },
            { where: { user_id: user.user_id } }
        );

        //masukin refresh token ke cookie (ini yang penting banget)
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: true // set to true if using HTTPS
        });


        res.status(200).json({
            status: "success",
            message: "Login successful",
            accessToken: accessToken,
            data: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_phone: user.user_phone,
                user_email: user.user_email
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: error.message });
    }
}

export async function logout(req, res) {
    try {
        // ambil refresh token dari cookie
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token found" });
        }

        const user = await UserModel.findOne({ where: { refresh_token: refreshToken } });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const userId = user.user_id;

        // delete refresh token di database
        await UserModel.update(
            { refresh_token: null },
            { where: { user_id: userId } }
        );

        res.clearCookie("refresh_token");

        return res.status(200).json({
            status: "success",
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: error.message });
    }
}

export async function updateProfile(req, res) {
  const { id } = req.params;
  const { user_name, user_phone, user_email, user_password } = req.body;

  try {
    const user = await UserModel.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user_name || !user_phone || !user_email)
      return res.status(400).json({ message: "All fields are required" });

    // Cek email
    const existingEmail = await UserModel.findOne({
      where: {
        user_email,
        user_id: { [Op.ne]: id } // (user yang lain)
      }
    });
    if (existingEmail)
      return res.status(409).json({ message: "Email already exists" });

    // Cek phone
    const existingPhone = await UserModel.findOne({
      where: {
        user_phone, 
        user_id: { [Op.ne]: id } // (user yang lain)
      }
    });
    if (existingPhone)
      return res.status(409).json({ message: "Phone number already exists" });

    user.user_name = user_name;
    user.user_phone = user_phone;
    user.user_email = user_email;
    if (user_password) {
      const hashedPassword = await bcrypt.hash(user_password, 10);
      user.user_password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_phone: user.user_phone,
        user_email: user.user_email
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
}
