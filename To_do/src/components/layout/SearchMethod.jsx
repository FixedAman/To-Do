import { useMemo, useState } from "react";

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
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 flex-1 rounded"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="all">All</option>
        <option value="completed">completed</option>
        <option value="pending">pending</option>
      </select>
    </div>
  );
};
export default TaskSearchFilter;
