import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, CircularProgress, TextField, Button
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeveloperTaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedTask, setEditedTask] = useState({});
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (userId) {
      fetchDeveloperTasks(userId);
    } else {
      console.error("❌ userId not found in localStorage.");
      setLoading(false);
    }
  }, [userId]);

  const fetchDeveloperTasks = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/user-tasks/${userId}`);
      if (response.data && Array.isArray(response.data.data)) {
        const fetchedTasks = response.data.data;
        setTasks(fetchedTasks);

        const initialEdited = {};
        fetchedTasks.forEach(task => {
          initialEdited[task._id] = {
            workedHr: task.workedHr ?? "",
            logDate: task.logDate
              ? new Date(task.logDate).toISOString().split("T")[0]
              : ""
          };
        });
        setEditedTask(initialEdited);
      } else {
        console.error("Unexpected API response format:", response.data);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (taskId, field, value) => {
    setEditedTask((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], [field]: value }
    }));
  };

  const handleUpdateTask = async (taskId) => {
    const updatedData = editedTask[taskId];

    if (!updatedData || !updatedData.workedHr || !updatedData.logDate) {
      toast.warn("⚠️ Please fill in Worked Hours and Log Date!", { position: "top-center" });
      return;
    }

    try {
      await axios.put(`http://localhost:3000/user-tasks/${taskId}`, updatedData);
      toast.success("✅ Task updated successfully!", { position: "top-center" });
      fetchDeveloperTasks(userId);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("❌ Failed to update task", { position: "top-center" });
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Typography variant="h5" gutterBottom style={styles.heading}>
          Assigned Tasks
        </Typography>

        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : tasks.length === 0 ? (
          <Typography variant="h6" style={styles.noData}>
            {userId ? "No assigned tasks." : "User not logged in. No tasks available."}
          </Typography>
        ) : (
          <Table style={styles.table}>
            <TableHead style={styles.tableHeader}>
              <TableRow>
                <TableCell><b>Module Name</b></TableCell>
                <TableCell><b>Task Name</b></TableCell>
                <TableCell><b>Priority</b></TableCell>
                <TableCell><b>Estimated Time</b></TableCell>
                <TableCell><b>Worked Hours</b></TableCell>
                <TableCell><b>Log Date</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((taskData) => {
                const task = taskData.taskId;
                if (!task) return null;

                const taskEdit = editedTask[taskData._id] || {};
                const workedHrValue = taskEdit.workedHr;
                const logDateValue = taskEdit.logDate;

                return (
                  <TableRow key={taskData._id} hover>
                    <TableCell>{task.moduleId?.moduleName || "Unknown Module"}</TableCell>
                    <TableCell>{task.title || "No Name"}</TableCell>
                    <TableCell>{task.priority || "N/A"}</TableCell>
                    <TableCell>{task.totalMinute || "N/A"} min</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={workedHrValue}
                        onChange={(e) => handleEditChange(taskData._id, "workedHr", e.target.value)}
                        variant="outlined"
                        size="small"
                        style={styles.inputField}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={logDateValue}
                        onChange={(e) => handleEditChange(taskData._id, "logDate", e.target.value)}
                        variant="outlined"
                        size="small"
                        style={styles.inputField}
                      />
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(`/developer/developertasklist/${taskData._id}`)}
                          style={styles.viewButton}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleUpdateTask(taskData._id)}
                          style={styles.updateButton}
                        >
                          Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "20px",
    overflowX: "hidden",
  },
  tableContainer: {
    flex: 1,
    width: "100%",
    maxWidth: "calc(100vw - 40px)",
  },
  heading: {
    margin: "20px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#5A6E58",
  },
  loader: {
    display: "block",
    margin: "auto",
  },
  noData: {
    textAlign: "center",
    marginTop: "30px",
  },
  inputField: {
    width: "120px",
    backgroundColor: "#fff",
    borderRadius: "5px",
  },
  updateButton: {
    backgroundColor: "#5A6E58",
    color: "#fff",
    textTransform: "none",
  },
  viewButton: {
    color: "#fff",
    backgroundColor: "#5A6E58",
    textTransform: "none",
  },
  table: {
    tableLayout: "fixed",
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#D0DDD0",
  },
};

export default DeveloperTaskList;
