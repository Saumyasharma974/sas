import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session for Premium Subscription
export const createCheckoutSession = asyncHandler(async (req, res) => {
    const { plan } = req.body; // Logic to handle multiple plans if needed, but we focus on Premium

    if (!plan) throw new ApiError(400, "Plan is required");

    // Define product details. In a real app, use Price IDs from Stripe Dashboard.
    // Here we create a one-time session for simplicity or subscription mode.
    // Let's assume a monthly subscription.

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription", // Use 'payment' for one-time
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Pro Plan - Monthly",
                        description: "Unlimited access to all AI features",
                    },
                    unit_amount: 1900, // $19.00
                    recurring: {
                        interval: "month",
                    },
                },
                quantity: 1,
            },
        ],
        customer_email: req.user.email, // Pre-fill email
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/`,
    });

    res.status(200).json(
        new ApiResponse(200, { sessionId: session.id, url: session.url }, "Checkout session created")
    );
});

// Verify session and upgrade user
// In production, use Stripe Webhooks. Here we use a manual verification endpoint called from frontend success page.
export const verifyPayment = asyncHandler(async (req, res) => {
    const { session_id } = req.body;
    if (!session_id) throw new ApiError(400, "Session ID required");

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
        const user = await userModel.findOne({ email: session.customer_details.email });
        if (user) {
            user.isPremium = true;
            user.credits = (user.credits || 0) + 500; // Add 500 Pro credits
            await user.save();
        }
        res.status(200).json(new ApiResponse(200, { isPremium: true, credits: user.credits }, "Upgraded to Premium"));
    } else {
        throw new ApiError(400, "Payment not completed");
    }
});
