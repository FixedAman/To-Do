import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PopupLogin = ({ onGuest, onGoogle, show, onClose }) => {
  // prevent scrolling when popup is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal box */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-lg text-center w-80 relative"
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-xl font-bold mb-4">
              Welcome to the To-Do List
            </h2>
            <p className="mb-6">Choose how you want to continue:</p>

            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg w-full mb-3 hover:bg-gray-600 transition"
              onClick={onGuest}
            >
              Continue as Guest
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition"
              onClick={onGoogle}
            >
              Sign in with Google
            </button>

            {/* Close button (optional) */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupLogin;
