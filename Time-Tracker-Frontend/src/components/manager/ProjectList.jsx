import React, { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Typography, CircularProgress 
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/projects")
      .then((response) => {
        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
          setProjects(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setProjects([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setProjects([]); 
        setLoading(false);
      });
  }, []);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <div style={styles.container}>
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Typography variant="h5" gutterBottom style={styles.heading}>
          Project List
        </Typography>

        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : projects.length === 0 ? (
          <Typography variant="h6" style={styles.noData}>
            No projects available.
          </Typography>
        ) : (
          <Table style={styles.table}>
            <TableHead style={styles.tableHeader}>
              <TableRow>
                <TableCell><b>Project Name</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Technology</b></TableCell>
                <TableCell><b>Estimated Hours</b></TableCell>
                <TableCell><b>Start Date</b></TableCell>
                <TableCell><b>Completion Date</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(projects) && projects.map((project) => (
                <TableRow key={project._id} hover>
                  <TableCell>{project.title || "No Title"}</TableCell>
                  <TableCell>{project.description || "No Description"}</TableCell>
                  <TableCell>{project.technology || "No Tech"}</TableCell>
                  <TableCell>{project.estimatedHours || "N/A"} hrs</TableCell>
                  <TableCell>{formatDate(project.startDate)}</TableCell>
                  <TableCell>{formatDate(project.completionDate)}</TableCell>
                  <TableCell>
                    {project.statusId && project.statusId.name ? project.statusId.name : "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      style={styles.button} 
                      onClick={() => navigate(`/manager/projectlist/${project._id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="contained" 
                      style={styles.button} 
                      onClick={() => navigate(`/manager/projectlist/${project._id}/add-module`, { state: { project } })}
                    >
                      Add Module
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
    overflowY: "auto", 
  },
  tableContainer: {
    flex: 1,  
    width: "100%",
    maxWidth: "calc(100vw - 20px)", 
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    overflowX: "hidden", 
    overflowY: "auto", 
  },
  heading: {
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px",
  },
  loader: {
    display: "block",
    margin: "auto",
    padding: "20px",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    color: "gray",
  },
  table: {
    width: "100%",
    tableLayout: "fixed", 
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#D0DDD0",
  },
  button: {
    backgroundColor: '#AAB99A',
    color: '#333',
    borderRadius: "5px",
    transition: "background-color 0.3s",
    margin: "5px"
  },
};

export default ProjectList;
