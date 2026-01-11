import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../componets/ui";
import DashboardLayout from "../componets/DashboardLayout";
import { CheckCircle, XCircle } from "lucide-react";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const verify = async () => {
            try {
                await axios.post(
                    "http://localhost:3000/api/ai/verify-payment",
                    { session_id: sessionId },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        withCredentials: true,
                    }
                );
                setStatus("success");
            } catch (error) {
                console.error("Verification failed:", error);
                setStatus("error");
            }
        };

        verify();
    }, [sessionId]);

    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                {status === "verifying" && (
                    <div className="animate-pulse">
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
                        <p className="text-neutral-400">Please wait a moment while we confirm your subscription.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="bg-green-500/10 p-8 rounded-2xl border border-green-500/20">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-neutral-300 mb-8 max-w-md">
                            You are now a Premium member! You have unlimited access to all AI features.
                        </p>
                        <Button
                            onClick={() => navigate("/summarizer")}
                            className="bg-green-600 hover:bg-green-700 w-full py-3 text-lg"
                        >
                            Start Using Premium
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="bg-red-500/10 p-8 rounded-2xl border border-red-500/20">
                        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-2">Verification Failed</h2>
                        <p className="text-neutral-300 mb-8 max-w-md">
                            We couldn't verify your payment. Note that using test keys requires test cards.
                        </p>
                        <Button
                            onClick={() => navigate("/")}
                            className="bg-neutral-700 hover:bg-neutral-600 w-full py-3 text-lg"
                        >
                            Go Home
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
