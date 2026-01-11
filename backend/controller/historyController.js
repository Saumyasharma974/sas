import History from "../models/History.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getHistory = asyncHandler(async (req, res) => {
    console.log("Fetching history for user:", req.user._id);
    const history = await History.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log("Found history items:", history.length);

    res.status(200).json(
        new ApiResponse(200, { history }, "History fetched successfully")
    );
});
