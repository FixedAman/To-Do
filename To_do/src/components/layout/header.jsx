import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  googleLogout,
  setGuestMode,
  signInWithGoogle,
} from "../../app/features/auth/authSlice";
import { MdDarkMode } from "react-icons/md";

const Header = () => {
  const dispatch = useDispatch();
  const { user, isGuest } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isDark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saveMode = localStorage.getItem("darkMode");
      if (saveMode !== null) return saveMode === true;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleToggle = () => {
    const newMode = !isDark;
    setDark(newMode);
    localStorage.setItem("darkMode", newMode);
    console.log(isDark);
  };
  return (
    <header className="w-full bg-zinc-900 text-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-bold">
            <Link to="/">ToDoApp</Link>
          </div>

          {/* Nav + Auth */}
          <div className="flex items-center gap-4">
            <Link to="/about-us" className="hover:underline text-sm">
              About
            </Link>
            <button onClick={handleToggle}>
              <MdDarkMode />
            </button>
            {!user ? (
              <>
                <button
                  onClick={() => dispatch(signInWithGoogle())}
                  className="bg-blue-500 hover:bg-blue-600 text-sm px-4 py-2 rounded-full transition-colors"
                >
                  Sign in Google
                </button>
                <button
                  onClick={() => dispatch(setGuestMode())}
                  className="bg-gray-500 hover:bg-gray-600 text-sm px-4 py-2 rounded-full transition-colors"
                >
                  Continue as Guest
                </button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {!isGuest && user?.photoURL ? (
                    <img
                      src={user.photoURL.replace("s96-c", "s400-c")}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-white text-xs">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm hidden sm:inline">
                    {isGuest ? "Guest" : user.name || "User"}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {isGuest ? "Guest User" : user.name || "User"}
                      </p>
                      {!isGuest && (
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        dispatch(googleLogout());
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
