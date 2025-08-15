// utils/deductCredit.js
import User from "../models/userModel.js";

export const deductCredit = async (userId, amount = 1) => {
  await User.findByIdAndUpdate(userId, { $inc: { credits: -amount } });
};
