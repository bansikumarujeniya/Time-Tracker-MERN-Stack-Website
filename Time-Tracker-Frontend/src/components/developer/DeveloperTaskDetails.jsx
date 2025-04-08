import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeveloperTaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workedHr, setWorkedHr] = useState("");
  const [statusId, setStatusId] = useState("");

  useEffect(() => {
    fetchUserTaskDetails();
  }, [taskId]);

  const fetchUserTaskDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user-tasks/single/${taskId}`);
      const userTask = response.data.data;

      if (userTask && userTask.taskId) {
        setTask(userTask.taskId);
        setWorkedHr(userTask.workedHr ?? "");
        setStatusId(userTask.taskId.statusId?._id || "");
      } else {
        setTask(null);
      }
    } catch (error) {
      console.error("❌ Error fetching task details:", error);
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!workedHr || workedHr <= 0) {
      toast.error("❌ Worked hours must be greater than zero.", {
        position: "top-center",
      });
      return;
    }

    try {

      await axios.put(`http://localhost:3000/user-tasks/${taskId}`, {
        workedHr,
        logDate: new Date().toISOString().split("T")[0],
      });

      // Update task status
      await axios.put(`http://localhost:3000/tasks/${task._id}`, { statusId });

      toast.success("✅ Task updated successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => navigate("/developer/developertasklist"), 2000);
    } catch (error) {
      console.error("❌ Error updating task:", error);
      toast.error("❌ Failed to update task", { position: "top-center" });
    }
  };

  return (
    <div style={styles.container}>
      <Paper style={styles.paper}>
        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : task ? (
          <>
            <Typography variant="h5" style={styles.heading}>
              Task Details
            </Typography>
            <Typography>
              <b>Task Name:</b> {task.title}
            </Typography>
            <Typography>
              <b>Description:</b> {task.description}
            </Typography>
            <Typography>
              <b>Priority:</b> {task.priority}
            </Typography>
            <Typography>
              <b>Estimated Time:</b> {task.totalMinute} min
            </Typography>
            <Typography>
              <b>Module:</b> {task.moduleId?.moduleName || "Unknown"}
            </Typography>

            <Select
              fullWidth
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              style={styles.selectField}
            >
              <MenuItem value="67d003e6805518892ba6eaa2">In Progress</MenuItem>
              <MenuItem value="67d00431805518892ba6eaa4">Completed</MenuItem>
              <MenuItem value="67d0044c805518892ba6eaa6">Pending</MenuItem>
            </Select>

            <div style={styles.inputButtonWrapper}>
              <TextField
                label="Worked Hours"
                type="number"
                fullWidth
                value={workedHr}
                onChange={(e) => setWorkedHr(e.target.value)}
                style={styles.inputField}
              />

              <Button variant="contained" onClick={handleUpdateTask} style={styles.button}>
                Save Changes
              </Button>
            </div>
          </>
        ) : (
          <Typography variant="h6" style={styles.noData}>
            Task not found.
          </Typography>
        )}
      </Paper>
      <ToastContainer />
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
  paper: {
    flex: 1,
    width: "100%",
    maxWidth: "calc(100vw - 40px)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#AAB99A",
  },
  heading: {
    margin: "20px 0",
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
    color: "gray",
  },
  selectField: {
    width: "100%",
    marginTop: "15px",
    backgroundColor: "#FFFFFF",
    borderRadius: "5px",
  },
  inputField: {
    width: "120px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    marginTop: "15px",
    marginBottom: "15px",
  },
  button: {
    marginTop: "15px",
    backgroundColor: "#5A6E58",
    color: "#fff",
    borderRadius: "5px",
    padding: "10px 20px",
    textTransform: "none",
  },
  inputButtonWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "15px",
  }
};


export default DeveloperTaskDetails;
