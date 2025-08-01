import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised- No token provided !!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised- Invalid token !!",
      });
    }

    const user = await User.findById(decoded.userId).select("-password"); //this "userId" written in "decoded.userId" is the userId coming from the token's assigned userId from auth controller.
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorised- User not found !!",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protected route middleware", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
