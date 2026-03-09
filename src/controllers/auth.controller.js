import { generateToken } from "../lib/JWTUtils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Bad Credentials!" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Bad Credentials!" });

    generateToken(user._id, res);
    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user,
    });
  } catch (error) {
    console.log(`error: ${error.message}`);

    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error Logging Out: " + error.message);
    res.status(500).json("Internel Server Error.");
  }
};

export const checkAuth = (req, res) => {
  try {
    console.log(req.user);

    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error checking auth: " + error.message);
    res.status(500).json({ message: "Internel Server Error." });
  }
};
