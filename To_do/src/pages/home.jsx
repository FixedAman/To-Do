import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskInFirebase,
  deleteTaskFromFirbase,
  fetchUserTasksFromFirebase,
  toggleTaskComplete,
  updateTasks,
} from "../app/features/tasks/taskSlice";
import Loader from "../components/ui/Loader";
import TaskSearchFilter from "../components/layout/SearchMethod";
import PopupLogin from "../components/layout/popupLogin";
import { setGuestMode, signInWithGoogle } from "../app/features/auth/authSlice";
import CategoryManager from "../components/layout/categoryManager";
import {
  addCategory,
  fetchCategories,
} from "../app/features/tasks/categorySlice";
import TaskList from "../components/layout/taskSection";
const Home = () => {
  const [taskText, setTaskText] = useState("");
  const [filteredTasks, setFilteredTask] = useState([]);
  const { user, isGuest } = useSelector((state) => state.auth);
  const [editingTask, setEditingTask] = useState(null);
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  console.log("This is from category homne ", selectedCategory);
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserTasksFromFirebase({ userId: user.uid }));
    }
  }, [user, dispatch]);
  const {
    allTasks,
    loading: allTaskLoader,
    error,
  } = useSelector((state) => state?.listOfTask);

  useEffect(() => {
    setFilteredTask(allTasks);
  }, [allTasks]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskText || !user.uid) return;

    try {
      //* creating a variable to store the category data after adding then connect to the main task
      let mainCategoryId;
      //* snapshot for category
      const categoryValue = selectedCategory;
      //* category adding
      if (categoryValue) {
        const newCategory = await dispatch(
          addCategory({
            userId: user.uid,
            category: selectedCategory,
          })
        ).unwrap();
        console.log("what is going on in category : ", selectedCategory);
        console.log("addCategory Result !", newCategory);
        mainCategoryId = newCategory.id;
      }

      //* updating the user
      if (editingTask) {
        await dispatch(
          updateTasks({
            newUpdateText: taskText,
            userId: user.uid,
            taskId: editingTask,
          })
        ).unwrap();
        setEditingTask(null);
        setTaskText("");
      } else {
        //* adding tasks
        await dispatch(
          addTaskInFirebase({
            taskText: taskText.trim(),
            userId: user.uid,
            categoryId: mainCategoryId,
          })
        ).unwrap();
      }
      setSelectedCategory(null);
      setTaskText("");
    } catch (err) {
      console.log(" Add/update task failed", err);

      alert(err?.message || "Failed to update and delete Task");
    }
  };

  //* handle completed button
  const handleToggleComplete = ({ taskId, completed }) => {
    dispatch(
      toggleTaskComplete({
        taskId,
        completed,
      })
    );
  };
  //* updatingText
  const handleUpdateText = (task) => {
    setTaskText(task.text);
    setEditingTask(task.id);
  };
  //* deleting user task
  const handleDelete = (taskId) => {
    dispatch(deleteTaskFromFirbase(taskId));
  };

  //* popup showpopup
  useEffect(() => {
    //*show popup
    if (!user) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [user]);
  return (
    <>
      <div>
        {showPopup && (
          <PopupLogin
            show={showPopup}
            onGuest={() => dispatch(setGuestMode())}
            onGoogle={() => dispatch(signInWithGoogle())}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>

      <div className="max-w-md mx-auto mt-16 p-4    ">
        <div className="search-and-title flex items-center  mb-8 flex-col">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            {isGuest ? "Guest Mode" : "My Tasks"}
          </h1>
          <div className="search-bar  mb-12">
            <TaskSearchFilter
              tasks={allTasks}
              onFilter={(filter) => setFilteredTask(filter)}
            />
          </div>
        </div>

        <form className="mb-6 gap-2 " onSubmit={handleSubmit}>
          <CategoryManager onCategoryChange={setSelectedCategory} />
          <input
            type="text"
            className="border  focus:outline-none px-3 py-2 rounded dark:text-white mt-2 "
            value={taskText}
            placeholder="Enter your task"
            onChange={(e) => setTaskText(e.target.value)}
            disabled={allTaskLoader}
          />
          <button
            type="submit"
            disabled={allTaskLoader || !taskText.trim()}
            className="bg-blue-500 text-white   p-2 rounded disabled:opacity-50
            "
          >
            {allTaskLoader ? <Loader /> : editingTask ? "update" : "add"}
          </button>
        </form>
        {allTaskLoader && allTasks?.length === 0 ? (
          <Loader />
        ) : allTasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            <TaskList
              filteredTasks={filteredTasks}
              handleUpdateText={handleUpdateText}
              onComplete={handleToggleComplete}
              loading={allTaskLoader}
              handleDelete={handleDelete}
            />
          </ul>
        )}
      </div>
    </>
  );
};

export default Home;
