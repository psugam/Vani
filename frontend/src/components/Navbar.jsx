import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getActiveClass = (path) => {
    return location.pathname === path ? "text-blue-600" : "";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="min-h-[10vh] bg-gray-100 border-b border-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-3xl font-bold">
            <Link to="/">Vāṇī</Link>
          </div>

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="flex space-x-8 text-lg">
              <li className={getActiveClass("/")}>
                <Link to="/">Home</Link>
              </li>
              <li className={getActiveClass("/lanman/toc")}>
                <Link to="/lanman/toc">Lanman's Reader</Link>
              </li>
              <li className={getActiveClass("/macdonnell/toc")}>
                <Link to="/macdonnell/toc">Macdonnell's Reader</Link>
              </li>
              <li className={getActiveClass("/dictionary")}>
                <Link to="/dictionary">Dictionary</Link>
              </li>
              <li className={getActiveClass("/transliterate")}>
                <Link to="/transliterate">Transliterate</Link>
              </li>
              <li className={getActiveClass("/resources")}>
                <Link to="/resources">Resources</Link>
              </li>
              <li className={getActiveClass("/about")}>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-100">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li className={getActiveClass("/")}>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className={getActiveClass("/lanman/toc")}>
              <Link to="/lanman/toc" onClick={closeMenu}>Lanman's Reader</Link>
            </li>
            <li className={getActiveClass("/macdonnell/toc")}>
              <Link to="/macdonnell/toc" onClick={closeMenu}>Macdonnell's Reader</Link>
            </li>
            <li className={getActiveClass("/dictionary")}>
              <Link to="/dictionary" onClick={closeMenu}>Dictionary</Link>
            </li>
            <li className={getActiveClass("/transliterate")}>
              <Link to="/transliterate" onClick={closeMenu}>Transliterate</Link>
            </li>
            <li className={getActiveClass("/resources")}>
              <Link to="/resources" onClick={closeMenu}>Resources</Link>
            </li>
            <li className={getActiveClass("/about")}>
              <Link to="/about" onClick={closeMenu}>About</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;