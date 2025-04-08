import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
    Typography, CircularProgress, Button 
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskList = () => {
    const { moduleId } = useParams();  // ✅ Extract moduleId from URL
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Ensure projectId is extracted correctly
    const projectId = location.state?.projectId;

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (moduleId) {
            fetchTasks(moduleId);
        }
    }, [moduleId]);

    const fetchTasks = async (moduleId) => {
        try {
            const response = await axios.get(`http://localhost:3000/tasks/module/${moduleId}`);
            if (response.data && Array.isArray(response.data.data)) {
                setTasks(response.data.data);
            } else {
                console.error("Unexpected API response format:", response.data);
                setTasks([]);
            }
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = () => {
        console.log("🔍 Extracted projectId:", projectId);  
        console.log("🔍 Extracted moduleId:", moduleId);  

        if (!projectId || !moduleId) {
            toast.error("❌ Project ID or Module ID is missing!", { position: "top-center" });
            return;
        }

        navigate(`/manager/projectlist/modules/${moduleId}/add-task`, {
            state: { projectId, moduleId },
        });
    };

    return (
        <div style={styles.container}>
            <TableContainer component={Paper} style={styles.tableContainer}>
                <Typography variant="h5" gutterBottom style={styles.heading}>
                    Task List for Module
                </Typography>
                
                {loading ? (
                    <CircularProgress style={styles.loader} />
                ) : tasks.length === 0 ? (
                    <Typography variant="h6" style={styles.noData}>
                        No tasks available for this module.
                    </Typography>
                ) : (
                    <Table style={styles.table}>
                        <TableHead style={styles.tableHeader}>
                            <TableRow>
                                <TableCell><b>Task Name</b></TableCell>
                                <TableCell><b>Description</b></TableCell>
                                <TableCell><b>Priority</b></TableCell>
                                <TableCell><b>Estimated Time</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task._id} hover>
                                    <TableCell>{task.title || "No Name"}</TableCell>
                                    <TableCell>{task.description || "No Description"}</TableCell>
                                    <TableCell>{task.priority || "N/A"}</TableCell>
                                    <TableCell>{task.totalMinute || "N/A"} min</TableCell>
                                    <TableCell>{task.statusId?.name || "Unknown"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <ToastContainer />
        </div>
    );
};

// ✅ **Styles**
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
        maxWidth: "calc(100vw - 20px)",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        backgroundColor: "#AAB99A",
    },
    heading: {
        textAlign: "center",
        fontWeight: "bold",
        padding: "10px",
        color: "#5A6E58",
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
    addButton: {
        backgroundColor: "#5A6E58",
        color: "white",
        marginBottom: "10px",
        display: "block",
        marginLeft: "auto",
    },
};

export default TaskList;
