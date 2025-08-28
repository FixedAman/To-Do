import { useEffect } from "react";

const PopupLogin = ({ onGuest, onGoogle }) => {
  // prevent scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);
  return (
    <div className="fixed insert-0 bg-black  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80">
        <h2 className="text-xl font-bold mb-4">Welcome to the To-Do List</h2>
        <p className="mb-6">Choose how you want to continue:</p>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-lg w-full mb-3 hover:bg-gray-600"
          onClick={onGuest}
        >
          Handleguest
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600"
          onClick={onGoogle}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
export default PopupLogin;
