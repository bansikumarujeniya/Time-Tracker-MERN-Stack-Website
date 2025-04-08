import React, { useEffect, useState } from "react";
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, CircularProgress, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3000/projects");
      setProjects(res.data?.data || []);
      setFilteredProjects(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (e) => {
    const selected = e.target.value;
    setStatusFilter(selected);
    if (selected === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (proj) => proj.statusId?.name === selected
      );
      setFilteredProjects(filtered);
    }
  };

  const handleDeleteProject = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the project.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5A6E58",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/projects/${id}`);
        toast.success("✅ Project deleted", { position: "top-center" });
        fetchProjects();
      } catch (err) {
        console.error("❌ Error deleting project:", err);
        toast.error("❌ Failed to delete project", { position: "top-center" });
      }
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />

      <TableContainer component={Paper} style={styles.tableContainer}>
        <Typography variant="h5" style={styles.heading}>All Projects</Typography>

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
                <TableCell><b>Project Title</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Technology</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj) => (
                  <TableRow key={proj._id}>
                    <TableCell>{proj.title}</TableCell>
                    <TableCell>{proj.description}</TableCell>
                    <TableCell>{proj.technology || "N/A"}</TableCell>
                    <TableCell>{proj.statusId?.name || "N/A"}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteProject(proj._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: "center", color: "#666" }}>
                    No projects found for this status.
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

export default AdminProjectManagement;
