import { useDispatch, useSelector } from "react-redux";

import {
  googleLogout,
  setGuestMode,
  signInWithGoogle,
} from "../../app/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const { user, isGuest } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect()
  return (
    <header className="flex justify-between items-center p-4 bg-zinc-900 text-white shadow">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link to={"/"}>ToDoApp</Link>
      </div>

      {/* Nav + Auth */}
      <div className="flex items-center gap-4">
        <Link to={"/about-us"} className="hover:underline text-sm">
          About
        </Link>

        {!user ? (
          <>
            <button
              onClick={() => dispatch(signInWithGoogle())}
              className="bg-blue-500 text-sm py-2 rounded-full p-4"
            >
              Sign in Google
            </button>
            <button
              onClick={() => dispatch(setGuestMode())}
              className="bg-gray-500 px-3   hover:bg-gray-600  text-sm py-2 rounded-2xl p-4"
            >
              Continue as Guest
            </button>
          </>
        ) : (
          <>
            {user && (
              <div className="relative " ref={dropdownRef}>
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
                        {user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm">
                    {isGuest ? "Guest" : user.name || "User"}
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(googleLogout());
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
