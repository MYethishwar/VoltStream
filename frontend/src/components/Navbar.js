import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// SVG Icons
const Icons = {
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
};

// ✅ All hooks are INSIDE the function component
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();       // ✅ inside component
  const navigate = useNavigate();            // ✅ inside component

  const navLinks = [
    ["Dashboard", "/dashboard"],
    ["Analytics", "/analytics"],
    ["Devices",   "/devices"],
    ["Billing",   "/billing"],
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black backdrop-blur-xl border-b border-cyan-500/10 py-3">
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
            <Icons.Zap />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            VoltStream
          </span>
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(([name, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `relative text-sm transition-colors duration-200 pb-1 ${
                  isActive
                    ? "text-cyan-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-cyan-400"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </div>

        {/* Right Side — auth-aware */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-400">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 bg-transparent border-0 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 bg-transparent border-0 cursor-pointer"
              >
                Sign In
              </button>
              <NavLink
                to="/dashboard"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                Launch Dashboard
              </NavLink>
              <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                      `
                      text-sm
                      transition-colors duration-200
                      ${
                        isActive
                          ? "text-cyan-400"
                          : "text-gray-300 hover:text-white"
                      }
                      `
                    }
                  >
                    Chat
                  </NavLink>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/5 p-6 space-y-4">
          {navLinks.map(([name, path]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block text-sm py-2 w-full text-left transition-colors ${
                  isActive ? "text-cyan-400" : "text-gray-300 hover:text-white"
                }`
              }
            >
              {name}
            </NavLink>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full px-6 py-2.5 rounded-lg border border-white/10 text-gray-300 text-sm text-center mt-4 hover:border-cyan-500/30 transition-all"
            >
              Sign Out ({user.name})
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm text-center mt-4"
            >
              Sign In
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;