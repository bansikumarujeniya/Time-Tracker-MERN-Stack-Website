import React, { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Typography, CircularProgress 
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ModulesList = () => {
  const { projectId } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/project-modules?projectId=${projectId}`)
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setModules(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setModules([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching modules:", error);
        setModules([]);
        setLoading(false);
      });
  }, [projectId]);

  return (
    <div style={styles.container}>
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Typography variant="h5" gutterBottom style={styles.heading}>
          Modules List
        </Typography>

        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : modules.length === 0 ? (
          <Typography variant="h6" style={styles.noData}>
            No modules available.
          </Typography>
        ) : (
          <Table style={styles.table}>
            <TableHead style={styles.tableHeader}>
              <TableRow>
                <TableCell><b>Module Name</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Estimated Hours</b></TableCell>
                <TableCell><b>Start Date</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {modules.map(module => (
                <TableRow key={module._id} hover>
                  <TableCell>{module.moduleName || "No Name"}</TableCell>
                  <TableCell>{module.description || "No Description"}</TableCell>
                  <TableCell>{module.estimatedHours || "N/A"} hrs</TableCell>
                  <TableCell>{module.startDate ? new Date(module.startDate).toLocaleDateString("en-GB") : "N/A"}</TableCell>
                  <TableCell>{module.statusId?.name || "Unknown"}</TableCell>
                  <TableCell style={styles.actionsCell}>
                    <Button 
                      variant="contained" 
                      style={styles.button} 
                      onClick={() => navigate(`/manager/projectlist/modules/${module._id}/tasks`,
                        {state: { projectId: module.projectId, moduleId: module._id }}
                      )}
                    >
                      View Tasks
                    </Button>
                    <Button 
                      variant="contained" 
                      style={styles.button} 
                      onClick={() => navigate(`/manager/projectlist/modules/${module._id}/add-task`,
                        { state: { module, projectId } }
                      )}
                    >
                      Add Task
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
  actionsCell: {
    display: "flex",
    flexDirection: "column", 
    alignItems: "center",
    gap: "8px",
  },
  button: {
    backgroundColor: '#AAB99A',
    color: '#333',
    borderRadius: "5px",
    transition: "background-color 0.3s",
    width: "130px", 
    padding: "8px",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default ModulesList;
