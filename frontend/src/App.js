import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import LearningGuide from "./pages/LearningGuide";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Devices from "./pages/Devices";
import Billing from "./pages/Billing";
import Login from "./pages/Login";

import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Security from "./pages/Security";
import Roadmap from "./pages/Roadmap";
import Blog from "./pages/Blog";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Chat from "./pages/Chat";
import ChatWidget from "./components/ChatWidget";





function PrivateRoute({ children }) {

  const { user } = useAuth();

  return user
    ? children
    : <Navigate to="/login" />;
}



function AppLayout() {

  return (
    <>
      <Navbar />

      <Routes>


        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/security" element={<Security />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/chat" element={<ChatWidget />} />
        


        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />

        <Route
          path="/devices"
          element={
            <PrivateRoute>
              <Devices />
            </PrivateRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <PrivateRoute>
              <Billing />
            </PrivateRoute>
          }
        />
        <Route
  path="/learning-guide"
  element={
    <PrivateRoute>
      <LearningGuide />
    </PrivateRoute>
  }
/>

      </Routes>
      <ChatWidget />
    </>
  );
}



function App() {

  return (
    
    <AuthProvider>

      <BrowserRouter>

        <Routes>


          <Route
            path="/login"
            element={<Login />}
          />


          <Route
            path="/*"
            element={<AppLayout />}
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;