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

const AdminModuleManagement = () => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
    fetchProjects();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get("http://localhost:3000/project-modules");
      setModules(res.data?.data || []);
      setFilteredModules(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching modules:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3000/projects");
      setProjects(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching projects:", err);
    }
  };

  const handleProjectFilterChange = (e) => {
    const selected = e.target.value;
    setSelectedProject(selected);
    if (selected === "") {
      setFilteredModules(modules);
    } else {
      const filtered = modules.filter(
        (mod) => mod.projectId?._id === selected
      );
      setFilteredModules(filtered);
    }
  };

  const handleDeleteModule = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the module.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5A6E58",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/project-modules/${id}`);
        toast.success("✅ Module deleted", { position: "top-center" });
        fetchModules();
      } catch (err) {
        console.error("❌ Error deleting module:", err);
        toast.error("❌ Failed to delete module", { position: "top-center" });
      }
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />

      <TableContainer component={Paper} style={styles.tableContainer}>
        <Typography variant="h5" style={styles.heading}>All Modules</Typography>

        <FormControl fullWidth style={{ marginBottom: "15px" }}>
          <InputLabel id="project-filter-label">Filter by Project</InputLabel>
          <Select
            labelId="project-filter-label"
            value={selectedProject}
            onChange={handleProjectFilterChange}
            label="Filter by Project"
          >
            <MenuItem value="">All Projects</MenuItem>
            {projects.map((proj) => (
              <MenuItem key={proj._id} value={proj._id}>
                {proj.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : (
          <Table style={styles.table}>
            <TableHead style={styles.tableHeader}>
              <TableRow>
                <TableCell><b>Module Name</b></TableCell>
                <TableCell><b>Project</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredModules.length > 0 ? (
                filteredModules.map((mod) => (
                  <TableRow key={mod._id}>
                    <TableCell>{mod.moduleName}</TableCell>
                    <TableCell>{mod.projectId?.title || "N/A"}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteModule(mod._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: "center", color: "#666" }}>
                    No modules found for this project.
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

export default AdminModuleManagement;
