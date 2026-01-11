import React from "react";
import { Button } from "../componets/ui";
import { Zap, Code, Image, Languages, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LandingPage() {
  const navigate = useNavigate();
  const [login, setLogin] = React.useState(false);
  // Fake purchase handler
  // Handle Stripe Purchase
  const handlePurchase = async (plan) => {
    if (!login) {
      navigate("/register");
      return;
    }

    if (plan === "Free") {
      navigate("/summarizer");
      return;
    }

    if (plan === "Pro") {
      try {
        const { data } = await axios.post(
          "http://localhost:3000/api/ai/create-checkout-session",
          { plan: "Pro" },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true
          }
        );
        // Redirect to Stripe Checkout
        window.location.href = data.data.url;
      } catch (err) {
        console.error("Purchase error:", err);
        alert("Failed to initiate payment");
      }
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      setLogin(true);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    navigate("/login");
    setLogin(false);
  };

  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold text-indigo-600">AI SaaS</h1>
        <div className="flex gap-6 text-sm font-medium">
          <a href="#features" className="hover:text-indigo-600">
            Features
          </a>
          <a href="#pricing" className="hover:text-indigo-600">
            Pricing
          </a>
          <a href="#contact" className="hover:text-indigo-600">
            Contact
          </a>
        </div>
        {login ? (
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-40 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            All Your <span className="text-indigo-600">AI Tools</span> in One
            Place
          </h1>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Boost productivity with instant AI-powered summarization,
            writing, coding assistance, and more.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {login ? (
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/summarizer")}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/register")}
              >
                Try for Free
              </Button>
            )}
            <a href="#features">
              <Button className="bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-14">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: Zap,
                title: "Summarizer",
                desc: "Concise summaries for any text.",
              },
              {
                icon: Code,
                title: "Code Assistant",
                desc: "Explain, debug, and understand code.",
              },
              {
                icon: Image,
                title: "Image Generator",
                desc: "Create visuals from text prompts.",
              },
              {
                icon: Languages,
                title: "Translator",
                desc: "Translate between languages instantly.",
              },
              {
                icon: Bug,
                title: "Resume Review",
                desc: "Get feedback on your resume.",
              },
              {
                icon: Bug,
                title: "Chat with PDF",
                desc: "Interactive chat with documents.",
              },
              {
                icon: Bug,
                title: "Article Writer",
                desc: "Generate full-length articles.",
              },
              {
                icon: Bug,
                title: "Blog Titles",
                desc: "Catchy titles for your posts.",
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white dark:bg-neutral-950 shadow hover:shadow-lg transition"
              >
                <Icon className="w-10 h-10 mx-auto text-indigo-600" />
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-12">
            No hidden fees. Cancel anytime.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                plan: "Free",
                price: "$0",
                features: ["Summarizer Tool", "Article Writer Tool", "History Access", "Community Support"],
              },
              {
                plan: "Pro",
                price: "$19/mo",
                features: [
                  "Everything in Free",
                  "Code Explainer & Debugger",
                  "Image Generator",
                  "Translator",
                  "Resume Review",
                  "Chat with PDF",
                  "Unlimited Usage"
                ],
              },

            ].map(({ plan, price, features }, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-xl shadow hover:shadow-lg transition flex flex-col ${plan === 'Pro' ? 'bg-indigo-900 text-white border-2 border-indigo-500 scale-105' : 'bg-white dark:bg-neutral-900'}`}
              >
                <h3 className="text-xl font-bold">{plan}</h3>
                <p className="text-4xl font-extrabold mt-4">{price}</p>
                <ul className="mt-6 space-y-2 text-left opacity-90 flex-1">
                  {features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-6 ${plan === 'Pro' ? 'bg-white text-indigo-900 hover:bg-gray-100' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  onClick={() => handlePurchase(plan)}
                >
                  {plan === "Free" ? "Get Started" : "Buy Now"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="contact"
        className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center"
      >
        <h2 className="text-3xl font-bold">Start Building with AI Today</h2>
        <p className="mt-4">
          Join thousands of developers and teams using AI to supercharge their
          work.
        </p>
        {!login && (
          <Button className="mt-6 text-black hover:bg-blue-600">
            Sign Up Now
          </Button>
        )}
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} AI SaaS. All rights reserved.
      </footer>
    </div>
  );
}
