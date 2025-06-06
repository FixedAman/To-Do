import { useDispatch, useSelector } from "react-redux";

import {
  googleLogout,
  setGuestMode,
  signInWithGoogle,
} from "../../app/features/auth/authSlice";
import { Link } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const { user, isGuest } = useSelector((state) => state.auth);
  console.log("User data", user);
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
            {!isGuest && user?.photoURL && (
              <img
                src={user.photoURL?.replace("s96-c", "s400-c")}
                alt="profile"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
            )}
            <span className="text-sm">
              {isGuest ? "Guest" : user.name || "User"}
            </span>
            <button
              onClick={() => dispatch(googleLogout())}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
