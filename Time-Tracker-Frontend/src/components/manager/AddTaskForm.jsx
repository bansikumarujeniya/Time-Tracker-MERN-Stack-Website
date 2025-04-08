import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Paper, Typography, Select, MenuItem } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTaskForm = ({ taskId, refreshTasks }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { projectId: paramProjectId, moduleId: paramModuleId } = useParams(); 

    const moduleData = location.state?.module || {};
    const projectId = location.state?.projectId || moduleData.projectId || paramProjectId || ""; 
    const moduleId = moduleData._id || paramModuleId || "";

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "Medium",
        statusId: "67d003e6805518892ba6eaa2",
        totalMinute: 0,
        moduleId: moduleId, 
        projectId: projectId, 
    });

    const statusOptions = [
        { _id: "67d003e6805518892ba6eaa2", name: "In Progress" },
        { _id: "67d00431805518892ba6eaa4", name: "Completed" },
        { _id: "67d0044c805518892ba6eaa6", name: "Pending" }
    ];

    useEffect(() => {
        console.log("✅ Extracted projectId:", projectId);
        console.log("✅ Extracted moduleId:", moduleId);

        if (taskId) {
            axios.get(`http://localhost:3000/tasks/${taskId}`)
                .then(response => {
                    const { title, description, priority, statusId, totalMinute, moduleId, projectId } = response.data.data;
                    setTaskData({
                        title: title || "",
                        description: description || "",
                        priority: priority || "Medium",
                        statusId: statusId ? statusId._id : "67d003e6805518892ba6eaa2",
                        totalMinute: totalMinute || 0,
                        moduleId: moduleId || "",
                        projectId: projectId || "",
                    });
                })
                .catch(error => console.error("Error fetching task:", error.response?.data || error));
        }
    }, [taskId]);

    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!taskData.moduleId || !taskData.projectId) {
            toast.error("❌ Error: Module ID or Project ID is missing!", { position: "top-center" });
            return;
        }

        try {
            if (taskId) {
                await axios.put(`http://localhost:3000/tasks/${taskId}`, taskData);
                toast.success("✅ Task updated successfully!", { position: "top-center", autoClose: 2000 });
            } else {
                await axios.post("http://localhost:3000/tasks", taskData);
                toast.success("✅ Task added successfully!", { position: "top-center", autoClose: 2000 });
            }

            refreshTasks && refreshTasks();

            
            setTimeout(() => navigate(`/manager/projectlist/modules/${taskData.moduleId}/tasks`), 2000);

        } catch (error) {
            console.error("❌ Error saving task:", error.response?.data || error);
            toast.error("❌ Error saving task: " + (error.response?.data.message || "Unknown error"), { position: "top-center" });
        }
    };

    return (
        <div style={styles.container}>
            <Paper style={styles.formContainer}>
                <Typography variant="h5" style={styles.heading}>
                    {taskId ? "Edit Task" : "Add New Task"}
                </Typography>

                <TextField
                    label="Task Name"
                    name="title"
                    fullWidth
                    margin="normal"
                    value={taskData.title}
                    onChange={handleChange}
                    style={styles.inputField}
                />
                <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    margin="normal"
                    value={taskData.description}
                    onChange={handleChange}
                    style={styles.inputField}
                />

                <Select
                    fullWidth
                    name="priority"
                    value={taskData.priority}
                    onChange={handleChange}
                    style={styles.selectField}
                >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                </Select>

                <Select
                    fullWidth
                    name="statusId"
                    value={taskData.statusId}
                    onChange={handleChange}
                    style={styles.selectField}
                >
                    {statusOptions.map(status => (
                        <MenuItem key={status._id} value={status._id}>{status.name}</MenuItem>
                    ))}
                </Select>

                <TextField
                    label="Total Minutes"
                    name="totalMinute"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={taskData.totalMinute}
                    onChange={handleChange}
                    style={styles.inputField}
                />

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    style={styles.button}
                >
                    {taskId ? "Update Task" : "Add Task"}
                </Button>
            </Paper>
            <ToastContainer />
        </div>
    );
};

// ✅ **Styles**
const styles = {
    container: {
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px",
        overflow: "hidden",
    },
    formContainer: {
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
    inputField: {
        width: "100%",
        marginBottom: "15px",
        backgroundColor: "#FFFFFF",
        borderRadius: "5px",
    },
    button: {
        backgroundColor: "#D0DDD0",
        color: "#333",
        borderRadius: "5px",
        padding: "10px 20px",
        display: "block",
        marginTop: "10px",
    },
    selectField: {
        width: "100%",
        marginBottom: "15px",
        backgroundColor: "#FFFFFF",
        borderRadius: "5px",
    },
};

export default AddTaskForm;
