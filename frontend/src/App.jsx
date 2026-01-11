import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Summarizer from "./pages/Summarizer";
import ImageGenerator from "./pages/ImageGenerator";
import CodeExplainer from "./pages/CodeExplainer";
import Translator from "./pages/Transalate";
import Profile from "./pages/Profile";
import CodeDebugger from "./pages/DebugCode";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import ResumeReview from "./pages/ResumeReview";
import ChatWithPDF from "./pages/ChatWithPDF";
import PaymentSuccess from "./pages/PaymentSuccess";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/image-generator" element={<ImageGenerator />} />
        <Route path="/code-explainer" element={<CodeExplainer />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/debugger" element={<CodeDebugger />} />
        <Route path="/write-article" element={<WriteArticle />} />
        <Route path="/blog-titles" element={<BlogTitles />} />
        <Route path="/resume-review" element={<ResumeReview />} />
        <Route path="/chat-pdf" element={<ChatWithPDF />} />
      </Routes>
    </Router>
  );
}

export default App;
