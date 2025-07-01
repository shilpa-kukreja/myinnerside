import React, { useState, useEffect, useContext } from "react";

import { FiSearch, FiBell, FiInfo, FiSun, FiMoon, FiUser, FiLogOut, FiSettings, FiHelpCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { TeamContext } from "../context/TeamContext";
import { AdminContext } from "../context/AdminContext";
import logo from '../assets/Image/logo/my-inner-side1.png'

const Navbar = ({ setToken }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
           (window.matchMedia("(prefers-color-scheme: dark)").matches && 
           localStorage.getItem("theme") !== "light");
  });
  // const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { aToken, setAToken}=useContext(AdminContext)
    const {tToken,setTToken}=useContext(TeamContext)
  const [hasNotifications, setHasNotifications] = useState(true);

  const navigate = useNavigate();

  // Apply theme styles
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      if (darkMode) {
        root.style.setProperty('--nav-bg', '#1e293b');
        root.style.setProperty('--bg-color', '#0f172a');
        root.style.setProperty('--text-color', '#f8fafc');
        root.style.setProperty('--border-color', '#334155');
        root.style.setProperty('--hover-color', '#334155');
        root.style.setProperty('--dropdown-bg', '#1e293b');
        root.style.setProperty('--dropdown-hover', '#334155');
        localStorage.setItem("theme", "dark");
      } else {
        root.style.setProperty('--nav-bg', '#ffffff');
        root.style.setProperty('--bg-color', '#f8fafc');
        root.style.setProperty('--text-color', '#0f172a');
        root.style.setProperty('--border-color', '#e2e8f0');
        root.style.setProperty('--hover-color', '#f1f5f9');
        root.style.setProperty('--dropdown-bg', '#ffffff');
        root.style.setProperty('--dropdown-hover', '#f1f5f9');
        localStorage.setItem("theme", "light");
      }
    };

    applyTheme();
  }, [darkMode]);

  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

    const logout=()=>{
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
        tToken && setTToken('')
        tToken && localStorage.removeItem('tToken')
    }

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     navigate(`/${encodeURIComponent(searchQuery)}`);
  //   }
  //   setSearchQuery("");
  //   setShowSearch(false);
  // };

  const handleNotificationClick = () => {
    setHasNotifications(false);
    // In a real app, you would navigate to notifications
    alert("Notifications panel would open here");
  };

  const handleInfoClick = () => {
    navigate("/about");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--nav-bg)] backdrop-blur supports-backdrop-blur:bg-[var(--nav-bg)/60]">
      <div className="container mx-auto px-4  ">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              <img
                src={logo}
                alt="Logo"
                className="w-36 transition-all duration-300 group-hover:scale-105"
              />
              
            </a>
          </div>

          {/* Search Bar - appears when showSearch is true */}
          {/* {showSearch ? (
            <form 
              onSubmit={handleSearch}
              className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md px-4"
            >
              <div className="relative"> */}
                {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="block w-full rounded-full border-0 bg-white/5 py-1.5 pl-10 pr-3 text-[var(--text-color)] ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setShowSearch(false);
                  }}
                />
              </div>
            </form>
          ) : (
            <div className="hidden md:flex items-center justify-center flex-1 mx-4">
              <button
                onClick={() => setShowSearch(true)}
                className="w-full max-w-md flex items-center justify-between rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] px-4 py-2 text-sm text-gray-500 hover:border-indigo-400 transition-colors duration-200"
              >
                <span>Search...</span>
                <div className="flex items-center">
                  <kbd className="hidden sm:inline-block mr-1 px-1.5 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">⌘K</kbd>
                  <FiSearch className="h-4 w-4" />
                </div>
              </button>
            </div>
          )} */}

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!showSearch && (
              <button
                onClick={() => setShowSearch(true)}
                className="md:hidden p-2 rounded-full hover:bg-[var(--hover-color)] text-[var(--text-color)]"
              >
                <FiSearch className="h-5 w-5" />
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--hover-color)] text-[var(--text-color)]"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={handleInfoClick}
              className="p-2 rounded-full hover:bg-[var(--hover-color)] text-[var(--text-color)]"
              aria-label="Help and information"
            >
              <FiHelpCircle className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2 rounded-full hover:bg-[var(--hover-color)] text-[var(--text-color)] relative"
                aria-label="Notifications"
              >
                <FiBell className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative ml-2">
              <button
                type="button"
                onClick={toggleDropdown}
                className="flex items-center rounded-full bg-[var(--hover-color)] p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <FiUser className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 mr-1 hidden sm:inline-block text-sm font-medium text-[var(--text-color)]">
                  My Inner Side
                </span>
                <svg
                  className={`ml-0.5 h-5 w-5 text-[var(--text-color)] transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-[var(--dropdown-bg)] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-[var(--border-color)]"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <div className="py-1" role="none">
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--dropdown-hover)]"
                      role="menuitem"
                    >
                      <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                      Your Profile
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--dropdown-hover)]"
                      role="menuitem"
                    >
                      <FiSettings className="mr-3 h-5 w-5 text-gray-400" />
                      Settings
                    </a>
                    <button
                      onClick={() => logout()}
                      className="flex w-full items-center px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--dropdown-hover)]"
                      role="menuitem"
                    >
                      <FiLogOut  onClick={() => logout()} className="mr-3 h-5 w-5 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;