import { useEffect, useState } from "react";

const CategoryManager = ({
  onCategoryChange,
  disabled = false,
  resetCategoryInput,
}) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(""); // optional user no need to add this if  they dont want
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [color, setColor] = useState("#3b82f6");
  const handleInputChange = (e) => {
    const v = e.target.value ?? "";
    setName(v);
  };
  const handleBlur = () => {
    onCategoryChange?.({ name: name.trim() });
  };
  //** detecting if addCategorySuccessfull automaticaly name will be removed */
  useEffect(() => {
    setName("");
  }, [resetCategoryInput]);
  return (
    <>
      <div className="border p-4  rounded dark:bg-slate-800 w-1/">
        <h2 className="font-semibold mb-2 dark:text-white">
          Manage Categories
        </h2>
        <input
          type="text"
          className="border px-2 py-1 rounded mb-3 w-full dark:bg-slate-700 dark:text-white"
          value={name}
          onChange={handleInputChange}
          placeholder="Category name"
          onBlur={handleBlur}
          disabled={disabled}
        />
        {/* // color picker  */}
        {/* <div className="mb-3 ">
          <p className="mb-1 dark:text-white">Pick a color : </p>
          <HexAlphaColorPicker color={color} onChange={setColor} />
          <div
            className="w-8 h-8 rounded-full mt-2 border"
            style={{ backgroundColor: color }}
          ></div>
        </div> */}
        {/* // emoji picker  */}
        {/* <div className="mb-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="border px-3 py- rounded bg-gray-200 dark:bg-slate-600"
          >
            {emoji || "pick emoji"}
          </button>
        </div> */}

        {/* {showEmojiPicker && (
            <>
              <div className="mt-2">
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setEmoji(e.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            </>
          )}
        </div> */}
        {/* // addButton  */}
        {/* <button type="button">use category</button> */}
      </div>
    </>
  );
};
export default CategoryManager;
