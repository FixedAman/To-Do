import { useDispatch, useSelector } from "react-redux";

import { signInWithGoogle } from "../../app/features/auth/authSlice";
import { Link } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const { user, isGuest } = useSelector((state) => state.auth);

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
              className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => dispatch(setGuestMode())}
              className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-600 text-sm"
            >
              Continue as Guest
            </button>
          </>
        ) : (
          <>
            <span className="text-sm">
              {isGuest ? "Guest" : user.name || "User"}
            </span>
            <button
              onClick={() => dispatch(logoutThunk())}
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
