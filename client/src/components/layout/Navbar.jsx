import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../common/Container";
import Button from "../common/Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="shrink-0">
              <h1 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                ConnectAI
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#how-it-works"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#why-us"
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Why Us
              </a>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button size="sm" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none focus:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-800">
              <a
                href="#how-it-works"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors duration-200"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#why-us"
                className="block px-3 py-2 text-slate-300 hover:text-white transition-colors duration-200"
              >
                Why Us
              </a>
              <div className="px-3 py-2">
                <Button size="sm" className="w-full" onClick={handleGetStarted}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
