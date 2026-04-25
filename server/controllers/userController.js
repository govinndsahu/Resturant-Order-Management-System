import z from "zod";
import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";
import { loginSchema, registerSchema } from "../validator/userSchema.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res, next) => {
  const { data, error, success } = registerSchema.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ message: "Invalid input data", errors: error.errors });
  }

  const { name, phone, password } = data;

  try {
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.find({}).lean();

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
    });

    if (user.length === 0) {
      newUser.role = 2; // Assign admin role to the first user
    }

    await newUser.save();

    const session = new Session({
      userId: newUser._id,
    });

    await session.save();

    res.cookie("sid", session._id.toString(), {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: "lax",
      maxAge: 60 * 1000 * 60 * 24 * 365, // 365 days
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { name: newUser.name, phone: newUser.phone, role: newUser.role },
    });
  } catch (error) {
    next(error);
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error registering user" });
  }
};

export const loginUser = async (req, res, next) => {
  const { data, error, success } = loginSchema.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ message: "Invalid input data", errors: error.errors });
  }

  const { phone, password } = data;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number or password" });
    }

    const session = new Session({
      userId: user._id,
    });

    await session.save();

    res.cookie("sid", session._id.toString(), {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: "lax",
      maxAge: 60 * 1000 * 60 * 24 * 365, // 365 days
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: { name: user.name, phone: user.phone, role: user.role },
    });
  } catch (error) {
    next(error);
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error logging in user" });
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const sessionId = req.signedCookies.sid;
    await Session.findByIdAndDelete(sessionId);

    return res.clearCookie("sid");
  } catch (error) {
    next(error);
    console.error("Error logging out user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error logging out user" });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
    console.error("Error fetching all users:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching all users" });
  }
};

export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { data, error, success } = z.string().length(24).safeParse(userId);

    if (!success) {
      return res
        .status(400)
        .json({ message: "Invalid user ID", errors: error.errors });
    }

    const user = await User.findById(data);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await Session.deleteMany({ userId: data });

    await User.findByIdAndDelete(data);

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
    console.error("Error deleting user by admin:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting user by admin" });
  }
};

export const makeStaffByAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { data, error, success } = z.string().length(24).safeParse(userId);

    if (!success) {
      return res
        .status(400)
        .json({ message: "Invalid user ID", errors: error.errors });
    }

    const user = await User.findById(data);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.role = 1;

    const savedUser = await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User made staff successfully" });
  } catch (error) {
    next(error);
    console.error("Error making user staff by admin:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error making user staff by admin" });
  }
};
