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
  const userId = user?.uid;
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
    if (userId) {
      dispatch(fetchCategories(userId));
    }
  }, [userId, dispatch]);
  const handleClick = async (catId) => {
    setActiveCategory(catId);
    console.log("this is elon cartID", catId);
    setOpenCategoryId((prev) => (prev === catId ? null : catId));
    //** */ fetching task clicked category
    await dispatch(fetchTasksByCategory({ userId, categoryId: catId }));
  };

  /** helper function to check  if the current category is open  */
  const isCategoryOpen = (catId) => openCategoryId === catId;

  return (
    <>
      {/* changing the ui in todo list  */}
      <aside className="fixed left-0 h-full w-64 bg-white p-4 z-50 ">
        <h3>Categories</h3>
        {catLoading ? <Loader /> : null}
        <nav className="flex flex-col gap-2">
          <button onClick={() => handleClick("all")}>all</button>
          <ul>
            {categories.map((cat) => {
              const isOpen = isCategoryOpen(cat.id);

              return (
                <li key={cat.id} className="bg-blue-500 flex flex-col ">
                  <div onClick={() => handleClick(cat.id)} className="flex">
                    {cat.name}
                    {isOpen ? (
                      <FaArrowDown className="w-4 h-4" />
                    ) : (
                      <FaArrowUp className="w-4 h-4" />
                    )}
                  </div>
                  {isOpen && taskLoading && <Loader />}
                  {/* // here the task list  */}
                  {isOpen && !taskLoading && (
                    <ul>
                      {tasks.length > 0
                        ? tasks.map((task) => {
                            return <li key={task.id}>{task.text}</li>;
                          })
                        : null}
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
