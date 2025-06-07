import { useState } from "react";

const Home = () => {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      setTaskList([...taskList, task]);
      setTask("");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mt-64">Add Task</h1>
      <div className="container flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
            className="border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </form>

        <div className="task-container">
          <ul className="list-decimal ml-5">
            {taskList.map((curr, index) => (
              <div className="task-container flex">
                <li key={index}>{curr}</li>
                <button>remove</button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
