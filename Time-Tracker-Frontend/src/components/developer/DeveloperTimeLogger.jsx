import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const DeveloperTimeLogger = () => {
  const [taskId, setTaskId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loggedTaskIds, setLoggedTaskIds] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalMin, setTotalMin] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUserTasks(userId);
      fetchLoggedTasks(userId);
    }
  }, [userId]);

  const fetchUserTasks = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:3000/user-tasks/${userId}`);
      const taskData = res.data?.data || [];
      setTasks(taskData);
      if (taskData.length > 0) {
      }
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoggedTasks = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:3000/time-logs`);
      const userLogs = res.data?.data?.filter(log => log.userId?._id === userId);
      const loggedIds = userLogs.map(log => log.taskId?._id);
      setLoggedTaskIds(loggedIds);
    } catch (err) {
      console.error("❌ Error fetching time logs:", err);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const minutes = Math.floor((end - start) / 60000);
      setTotalMin(minutes > 0 ? minutes : 0);
    }
  }, [startDate, endDate]);

  const handleSubmit = async () => {
    if (!taskId || !startDate) {
      toast.warn("⚠️ Please select a task and start time.", { position: "top-center" });
      return;
    }

    try {
      await axios.post("http://localhost:3000/time-logs/add", {
        userId,
        taskId,
        startDate,
        endDate,
        totalMin,
      });

      toast.success("✅ Time log submitted!", { position: "top-center" });

      setTaskId("");
      setStartDate("");
      setEndDate("");
      setTotalMin(0);

      setTimeout(() => {
        navigate("/developer/timeloglist");
      }, 1000);
    } catch (err) {
      console.error("❌ Error saving time log:", err);
      toast.error("❌ Failed to submit log", { position: "top-center" });
    }
  };

  const getProjectTitle = (task) => {
    if (task.moduleId?.projectId) {
      if (typeof task.moduleId.projectId === 'string') {
        return task.moduleId.projectId; 
      } else if (task.moduleId.projectId.title) {
        return task.moduleId.projectId.title;
      } else {
        console.log("ProjectId exists but no title:", task.moduleId.projectId);
        return "Project (No Title)";
      }
    }
    console.log("No moduleId.projectId found for task:", task);
    return "Unassigned Project";
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <Paper style={styles.tableContainer}>
        <Typography variant="h5" gutterBottom style={styles.heading}>
          Time Logger
        </Typography>

        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : (
          <>
            <Select
              fullWidth
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              displayEmpty
              style={styles.inputField}
            >
              <MenuItem value="" disabled>Select Task</MenuItem>
              {tasks
                .filter(taskObj => taskObj.taskId && !loggedTaskIds.includes(taskObj.taskId._id))
                .map((taskObj) => {
                  const task = taskObj.taskId;
                  return (
                    <MenuItem key={taskObj._id} value={task._id}>
                      {getProjectTitle(task)} ({task.title} - {task.description || "No Description"})
                    </MenuItem>
                  );
                })}
            </Select>

            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.inputField}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.inputField}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Total Minutes"
              value={totalMin}
              fullWidth
              style={styles.inputField}
            />

            <Button
              variant="contained"
              fullWidth
              style={styles.updateButton}
              onClick={handleSubmit}
              disabled={!taskId || !startDate || totalMin <= 0}
            >
              Submit Log
            </Button>
          </>
        )}
      </Paper>
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
    padding: "20px",
    backgroundColor: "#AAB99A",
    borderRadius: "10px",
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
  inputField: {
    width: "100%",
    margin: "10px 0",
    backgroundColor: "#fff",
    borderRadius: "5px",
  },
  updateButton: {
    marginTop: "10px",
    backgroundColor: "#5A6E58",
    color: "#fff",
    textTransform: "none",
  },
};

export default DeveloperTimeLogger;