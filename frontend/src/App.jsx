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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/image-generator" element={<ImageGenerator />} />
        <Route path="/code-explainer" element={<CodeExplainer />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/debugger" element={<CodeDebugger/>}/>
      </Routes>
    </Router>
  );
}

export default App;
