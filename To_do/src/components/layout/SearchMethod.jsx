import { useMemo, useState } from "react";
import { FcSearch } from "react-icons/fc";
const TaskSearchFilter = ({ tasks, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    const normalizedText = searchTerm.toLowerCase().trim();
    return tasks.filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(normalizedText);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "completed"
          ? task.completed
          : !task.completed;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchTerm, filter]);

  onFilter(filteredTasks);
  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search your tasks"
        className="border p-2 flex-1 rounded dark:text-white  focus:outline-none bg-transparent "
      />
      <FcSearch className="text-xl mr-2 broder cursor-pointer" />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded dark:text-white dark:bg-slate-900 ml-3 "
      >
        <option value="all">All</option>
        <option value="completed">completed</option>
        <option value="pending">pending</option>
      </select>
    </div>
  );
};
export default TaskSearchFilter;
