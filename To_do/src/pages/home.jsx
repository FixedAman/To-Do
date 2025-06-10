import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskInFirebase,
  deleteTaskFromFirbase,
  fetchUserTasksFromFirebase,
  toggleTaskComplete,
} from "../app/features/tasks/taskSlice";
const Home = () => {
  const [taskText, setTaskText] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isGuest } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserTasksFromFirebase(user.uid));
    }
  }, [user, dispatch]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim() && user?.uid) {
      dispatch(
        addTaskInFirebase({
          taskText: taskText.trim(),
          userId: user.uid,
        })
      );
      setTaskText("");
    }
  };
  const handleDelete = (taskId) => {
    dispatch(deleteTaskFromFirbase(taskId));
  };
  const handleToggleComplete = (taskId, completed) => {
    dispatch(
      toggleTaskComplete({
        taskId,
        completed,
      })
    );
  };
  return (
    <>
      <div className="max-w-md mx-auto mt-16 p-4">
        <h1 className="text-2xl font-bold mb-4">
          {isGuest ? "Guest Mode" : "My Tasks"}
        </h1>
        <form className="mb-6 gap-2 flex" onSubmit={handleSubmit}>
          <input
            type="text"
            className="border px-3 py-2 rounded flex-grow"
            value={taskText}
            placeholder="enter your task"
            onChange={(e) => setTaskText(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !taskText.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
        {loading && taskList.length === 0 ? (
          <p>Loading Task</p>
        ) : taskList.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {taskList.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-white p-3 rounded shadow"
              >
                <span>{task.text}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  disabled={loading}
                  onClick={() => handleDelete(task.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Home;
