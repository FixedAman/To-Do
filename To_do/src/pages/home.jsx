import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCircleCheck } from "react-icons/fa6";
import {
  addTaskInFirebase,
  deleteTaskFromFirbase,
  fetchUserTasksFromFirebase,
  toggleTaskComplete,
} from "../app/features/tasks/taskSlice";
import { MdDelete } from "react-icons/md";
import Loader from "../components/ui/Loader";
import TaskSearchFilter from "../components/layout/SearchMethod";
const Home = () => {
  const [taskText, setTaskText] = useState("");
  const [filteredTasks, setFilteredTask] = useState([]);
  const { user, isGuest } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserTasksFromFirebase({ userId: user.uid }));
    }
  }, [user, dispatch]);
  const { tasks, loading, error } = useSelector((state) => state.listOfTask);
  useEffect(() => {
    setFilteredTask(tasks);
  }, [tasks]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (taskText.trim() && user?.uid) {
      try {
        await dispatch(
          addTaskInFirebase({
            taskText: taskText.trim(),
            userId: user.uid,
          })
        ).unwrap();
        setTaskText("");
      } catch (err) {
        console.log("this is error ", error);
        alert(error);
      }
    }
  };
  const handleDelete = (taskId) => {
    dispatch(deleteTaskFromFirbase(taskId));
  };
  const handleToggleComplete = ({ taskId, completed }) => {
    dispatch(
      toggleTaskComplete({
        taskId,
        completed,
      })
    );
  };
  return (
    <>
      <div className="max-w-md mx-auto mt-16 p-4   ">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          {isGuest ? "Guest Mode" : "My Tasks"}
        </h1>
        <div className="search-bar justify-end flex mb-12">
          <TaskSearchFilter
            tasks={tasks}
            onFilter={(filter) => setFilteredTask(filter)}
          
          />
        </div>
        <form className="mb-6 gap-2 flex" onSubmit={handleSubmit}>
          <input
            type="text"
            className="border  focus:outline-none px-3 py-2 rounded flex-grow dark:text-white"
            value={taskText}
            placeholder="Enter your task"
            onChange={(e) => setTaskText(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !taskText.trim()}
            className="bg-blue-500 text-white  px-4 py-2 rounded disabled:opacity-50
            "
          >
            {loading ? <Loader /> : "add"}
          </button>
        </form>
        {loading && tasks.length === 0 ? (
          <p>Loading Task</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between dark:bg-slate-700 p-3 rounded shadow"
              >
                <span className="dark:text-slate-200">{task.text}</span>
                <div className="button-components flex">
                  <button
                    className=" p-2 text-red-500 hover:text-red-700 
    dark:text-red-400 dark:hover:text-red-300
    transition-colors duration-200
    rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
                    disabled={loading}
                    onClick={() => handleDelete(task.id)}
                  >
                    <MdDelete />
                  </button>
                  <button
                    className={`p-2 ml-2
    text-gray-400 hover:text-green-500 
    dark:text-gray-500 dark:hover:text-green-400
    transition-colors duration-200
    rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 
     
     `}
                    disabled={loading}
                    onClick={() =>
                      handleToggleComplete({
                        taskId: task.id,
                        completed: task.completed,
                      })
                    }
                  >
                    <FaCircleCheck
                      className={`${
                        task.completed
                          ? "text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Home;
