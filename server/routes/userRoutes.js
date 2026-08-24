import express from "express";

import {
  deleteUserByAdmin,
  getAllUsers,
  getAllUsersDetails,
  getUser,
  loginUser,
  logoutUser,
  makeStaffByAdmin,
  registerUser,
} from "../controllers/userController.js";
import { isAdmin, isLogedIn } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", isLogedIn, logoutUser);

router.get("/", isLogedIn, isAdmin, getAllUsers);

router.get("/me", isLogedIn, getUser);

router.get("/details/get", getAllUsersDetails);

router.post("/update/:userId", isLogedIn, isAdmin, makeStaffByAdmin);

router.delete("/delete/:userId", isLogedIn, isAdmin, deleteUserByAdmin);

export default router;
