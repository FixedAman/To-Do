import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../app/features/tasks/categorySlice";
import { fetchTasksByCategory } from "../../app/features/tasks/taskSlice";

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
  const [activeCategory, setActiveCategory] = useState("all");
  useEffect(() => {
    if (userId) {
      dispatch(fetchCategories(userId));
      dispatch(fetchTasksByCategory({ userId, categoryId: "all" }));
    }
  }, [userId, dispatch]);
  const handleClick = async (catId) => {
    setActiveCategory(catId);
    await dispatch(fetchTasksByCategory({ userId, categoryId: catId }));
  };
  return (
    <>
      <aside className="fixed left-0 h-full w-64 bg-white p-4 z-50 ">
        <h3>Categories</h3>
        {"loader will be here "}
        <nav className="flex flex-col gap-2">
          <button onClick={() => handleClick("all")}>all</button>
          <ul>
            {categories.map((cat) => {
              return <li key={cat.id} className="bg-blue-500">{cat.name}</li>;
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
export default MainSidebar;
