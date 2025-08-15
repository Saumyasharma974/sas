import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


const auth = async (req, res, next) => {
  console.log(req.cookies);
  const token = req?.cookies?.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
};

export default auth;
