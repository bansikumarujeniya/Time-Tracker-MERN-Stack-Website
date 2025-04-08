import React, { useEffect, useState } from "react";
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, FormControl, InputLabel,
  Select, MenuItem, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminTimeLogManagement = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, usersRes, projectsRes] = await Promise.all([
        axios.get("http://localhost:3000/time-logs"),
        axios.get("http://localhost:3000/users"),
        axios.get("http://localhost:3000/projects"),
      ]);

      const allLogs = logsRes.data?.data || [];
      const developers = usersRes.data?.data?.filter(u => u.roleId?.name === "Developer") || [];
      const allProjects = projectsRes.data?.data || [];

      setLogs(allLogs);
      setFilteredLogs(allLogs);
      setUsers(developers);
      setProjects(allProjects);
    } catch (err) {
      console.error("❌ Error loading logs:", err);
      toast.error("Failed to load time logs");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(/am|pm/, (match) => match.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handleUserFilterChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    applyFilters(userId, selectedProject);
  };

  const handleProjectFilterChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    applyFilters(selectedUser, projectId);
  };

  const applyFilters = (userId, projectId) => {
    let filtered = [...logs];

    if (userId) {
      filtered = filtered.filter(log => log.userId?._id === userId);
    }

    if (projectId) {
      filtered = filtered.filter(log => log.taskId?.moduleId?.projectId?._id === projectId);
    }

    setFilteredLogs(filtered);
  };

  const handleDeleteLog = async (logId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the time log.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5A6E58",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/time-logs/${logId}`);
        toast.success("✅ Log deleted successfully", { position: "top-center" });
        fetchData();
      } catch (err) {
        console.error("❌ Error deleting log:", err);
        toast.error("❌ Failed to delete log", { position: "top-center" });
      }
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Typography variant="h5" style={styles.heading}>All Time Logs</Typography>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <FormControl fullWidth>
            <InputLabel>Filter by Developer</InputLabel>
            <Select value={selectedUser} onChange={handleUserFilterChange} label="Filter by Developer">
              <MenuItem value="">All Developers</MenuItem>
              {users.map(user => (
                <MenuItem key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Filter by Project</InputLabel>
            <Select value={selectedProject} onChange={handleProjectFilterChange} label="Filter by Project">
              <MenuItem value="">All Projects</MenuItem>
              {projects.map(proj => (
                <MenuItem key={proj._id} value={proj._id}>
                  {proj.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : (
          <Table style={styles.table}>
            <TableHead style={styles.tableHeader}>
              <TableRow>
                <TableCell><b>Task</b></TableCell>
                <TableCell><b>Project</b></TableCell>
                <TableCell><b>Start Time</b></TableCell>
                <TableCell><b>End Time</b></TableCell>
                <TableCell><b>Total Minutes</b></TableCell>
                <TableCell><b>Logged On</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{log.taskId?.title} ({log.taskId?.description})</TableCell>
                    <TableCell>{log.taskId?.moduleId?.projectId?.title || "N/A"}</TableCell>
                    <TableCell>{formatDateTime(log.startDate)}</TableCell>
                    <TableCell>{log.endDate ? formatDateTime(log.endDate) : "-"}</TableCell>
                    <TableCell>{log.totalMin || 0} min</TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteLog(log._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center", color: "#666" }}>
                    No logs found for selected filters.
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
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: "10px",
    color: "#5A6E58",
  },
  loader: {
    display: "block",
    margin: "30px auto",
  },
  tableHeader: {
    backgroundColor: "#D0DDD0",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
  },
};

export default AdminTimeLogManagement;
