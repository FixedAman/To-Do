import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../app/features/tasks/categorySlice";
import { fetchTasksByCategory } from "../../app/features/tasks/taskSlice";
import { FaArrowDown, FaRainbow } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";
import Loader from "../ui/Loader";
const MainSidebar = () => {
  // ** all redux queries
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { categories, loading: catLoading } = useSelector(
    (state) => state.listOfCategory
  );
  const { tasks, loading: taskLoading } = useSelector(
    (state) => state.listOfTask
  );
  console.log("this is all : ", categories);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  useEffect(() => {
    if (user) {
      dispatch(fetchCategories(user.uid));
    }
  }, [user, dispatch]);

  const handleClick = async (catId) => {
    if (!user) {
      console.warn("No userId , skipFetchCategory");
      return;
    }
    setActiveCategory(catId);
    console.log("this is elon cartID", catId);
    setOpenCategoryId((prev) => (prev === catId ? null : catId));
    //** */ fetching task clicked category
    await dispatch(
      fetchTasksByCategory({ userId: user?.uid, categoryId: catId })
    );
  };
  // useEffect(() => {
  //   const isReload =
  //     performance.navigation.type === performance.navigation.TYPE_RELOAD;
  //   if (isReload) {
  //     alert("page reload!");
  //   } else {
  //     alert("page not found!");
  //   }
  // }, [handleClick]);
  /** helper function to check  if the current category is open  */
  const isCategoryOpen = (catId) => openCategoryId === catId;

  return (
    <>
      {/* changing the ui in todo list  */}
      <aside
        className="fixed left-0  w-64 
                 bg-white dark:bg-zinc-900 
                 border-r border-gray-200 dark:border-zinc-800
                 p-4 z-50 dark:text-white overflow-y-auto h-full"
      >
        <h3 className="text-lg font-semibold pb-2 mb-4 border-b border-gray-300 dark:border-zinc-700">
          Categories
        </h3>

        {catLoading && <Loader />}

        <nav className="flex flex-col gap-2">
          {/* All button */}
          <button
            onClick={() => handleClick("all")}
            className="text-left px-3 py-2 rounded 
                 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            All
          </button>

          <ul className="space-y-2">
            {categories.map((cat) => {
              const isOpen = isCategoryOpen(cat.id);

              return (
                <li key={cat.id} className="flex flex-col">
                  {/* Category row */}
                  <button
                    onClick={() => handleClick(cat.id)}
                    className="flex items-center justify-between 
                         px-3 py-2 rounded text-left 
                         hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    <span>{cat.name}</span>

                    {isOpen ? (
                      <FaArrowDown className="w-4 h-4" />
                    ) : (
                      <FaArrowUp className="w-4 h-4" />
                    )}
                  </button>

                  {/* Loader under category */}
                  {isOpen && taskLoading && (
                    <div className="pl-4 pt-1">
                      <Loader />
                    </div>
                  )}

                  {/* Tasks under category */}
                  {isOpen && !taskLoading && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-gray-300 dark:border-zinc-700 pl-3">
                      {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {index + 1}. {task.text}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-400">No tasks</li>
                      )}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
export default MainSidebar;
