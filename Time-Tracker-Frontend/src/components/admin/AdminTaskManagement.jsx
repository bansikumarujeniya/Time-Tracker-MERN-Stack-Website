import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/tasks");
      setTasks(res.data?.data || []);
      setFilteredTasks(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (e) => {
    const selected = e.target.value;
    setStatusFilter(selected);
    if (selected === "") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.statusId?.name === selected);
      setFilteredTasks(filtered);
    }
  };

  const handleDeleteTask = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the task.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5A6E58",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/tasks/${id}`);
        toast.success("✅ Task deleted", { position: "top-center" });
        fetchTasks();
      } catch (err) {
        console.error("❌ Error deleting task:", err);
        toast.error("❌ Failed to delete task", { position: "top-center" });
      }
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />

      <TableContainer component={Paper} style={styles.tableContainer}>
        <Typography variant="h5" style={styles.heading}>
          All Tasks
        </Typography>

        <FormControl fullWidth style={{ marginBottom: "15px" }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Filter by Status"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>

        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : (
          <Table style={styles.table}>
            <TableHead style={styles.tableHeader}>
              <TableRow>
                <TableCell><b>Task Name</b></TableCell>
                <TableCell><b>Project</b></TableCell>
                <TableCell><b>Priority</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Estimated Minutes</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{`${task.title} (${task.description || "No Description"})`}</TableCell>
                    <TableCell>{task.moduleId?.projectId?.title || "N/A"}</TableCell>
                    <TableCell>{task.priority || "N/A"}</TableCell>
                    <TableCell>{task.statusId?.name || "N/A"}</TableCell>
                    <TableCell>{task.totalMinute ?? 0}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center", color: "#666" }}>
                    No tasks found for this status.
                  </TableCell>
                </TableRow>
              )}
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
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "20px",
    overflowX: "hidden",
  },
  heading: {
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: "10px",
    color: "#5A6E58",
  },
  loader: {
    display: "block",
    margin: "30px auto",
  },
  tableContainer: {
    flex: 1,
    width: "100%",
    maxWidth: "calc(100vw - 40px)",
    padding: "20px",
    backgroundColor: "#AAB99A",
    borderRadius: "10px",
  },
  tableHeader: {
    backgroundColor: "#D0DDD0",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
  },
};

export default AdminTaskManagement;
