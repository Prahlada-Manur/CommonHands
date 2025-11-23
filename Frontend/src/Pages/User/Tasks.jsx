import { useEffect, useState } from "react";
import axios from "../../config/axios";

export default function Tasks() {
  const [tasksData, setTasksData] = useState(null);
  const [error, setError] = useState("");

  // Filters
  const [taskType, setTaskType] = useState(""); // Volunteer or funding
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch tasks with query params
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks", {
        params: {
          type: taskType || undefined,
          q: search || undefined,
          page,
          limit: 6,
        },
      });
      setTasksData(response.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [taskType, search, page]);

  if (error) return <h2>{error}</h2>;
  if (!tasksData) return <h2>Loading Tasks...</h2>;

  return (
    <div>
      <h1>Available Tasks</h1>

      {/* FILTERS */}
      <div>
        {/* Task Type */}
        <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
          <option value="">All</option>
          <option value="Volunteer">Volunteer</option>
          <option value="funding">Funding</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LIST TASKS */}
      {tasksData.tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
          }}
        >
          {/* Task Image */}
          {task.images?.length > 0 && (
            <img
              src={task.images[0].url}
              alt="task"
              width="200"
              height="120"
              style={{ objectFit: "cover" }}
            />
          )}

          {/* Title */}
          <h2>{task.title}</h2>

          {/* Description */}
          <p>{task.description}</p>

          {/* Location */}
          <p>
            <strong>Location:</strong> {task.location?.address}
          </p>

          {/* Task Type */}
          <p>
            <strong>Type:</strong> {task.taskType}
          </p>

          {/* Deadline */}
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(task.deadline).toDateString()}
          </p>
        </div>
      ))}

      {/* PAGINATION */}
      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span> Page {tasksData.currentPage} / {tasksData.totalPage} </span>

        <button
          disabled={page === tasksData.totalPage}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
