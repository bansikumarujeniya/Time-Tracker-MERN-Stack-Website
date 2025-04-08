import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Paper, Typography, Select, MenuItem } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddModuleForm = ({ moduleId, refreshModules }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const project = location.state?.project || {};

    const [moduleData, setModuleData] = useState({
        moduleName: project.title || "",
        description: project.description || "",
        estimatedHours: project.estimatedHours || "",
        startDate: project.startDate ? project.startDate.split("T")[0] : "",
        statusId: "67d003e6805518892ba6eaa2",
        projectId: project._id || "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    const statusOptions = [
        { _id: "67d003e6805518892ba6eaa2", name: "In Progress" },
        { _id: "67d00431805518892ba6eaa4", name: "Completed" },
        { _id: "67d0044c805518892ba6eaa6", name: "Pending" }
    ];

    
    useEffect(() => {
        if (moduleId) {
            setLoading(true);
            axios.get(`http://localhost:3000/project-modules/${moduleId}`)
                .then(response => {
                    const { moduleName, description, estimatedHours, startDate, statusId, projectId } = response.data.data;
                    setModuleData({
                        moduleName: moduleName || "",
                        description: description || "",
                        estimatedHours: estimatedHours || "",
                        startDate: startDate ? startDate.split("T")[0] : "",
                        statusId: statusId ? statusId._id : "67d003e6805518892ba6eaa2",
                        projectId: projectId || "",
                    });
                })
                .catch(error => console.error("Error fetching module:", error.response?.data || error))
                .finally(() => setLoading(false));
        }
    }, [moduleId]);

    const handleChange = (e) => {
        setModuleData({ ...moduleData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!moduleData.projectId) {
            toast.error("Error: Project ID is missing!", { position: "top-center" });
            return;
        }

        setIsSubmitting(true);
        try {
            if (moduleId) {
                await axios.put(`http://localhost:3000/project-modules/${moduleId}`, moduleData);
                toast.success("Module updated successfully!", { position: "top-center", autoClose: 2000 });
            } else {
                await axios.post("http://localhost:3000/project-modules", moduleData);
                toast.success("Module added successfully!", { position: "top-center", autoClose: 2000 });
            }

            refreshModules && refreshModules();
            setTimeout(() => navigate(`/manager/modulelist`), 2000);
        } catch (error) {
            console.error("Error saving module:", error.response?.data || error);
            toast.error("Error saving module: " + (error.response?.data.message || "Unknown error"), { position: "top-center" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <Paper style={styles.formContainer}>
                <Typography variant="h5" style={styles.heading}>
                    {moduleId ? "Edit Module" : "Add New Module"}
                </Typography>

                <TextField
                    label="Module Name"
                    name="moduleName"
                    fullWidth
                    margin="normal"
                    value={moduleData.moduleName}
                    onChange={handleChange}
                    style={styles.inputField}
                />
                <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    margin="normal"
                    value={moduleData.description}
                    onChange={handleChange}
                    style={styles.inputField}
                />
                <TextField
                    label="Estimated Hours"
                    name="estimatedHours"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={moduleData.estimatedHours}
                    onChange={handleChange}
                    style={styles.inputField}
                />
                <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    fullWidth
                    margin="normal"
                    value={moduleData.startDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    style={styles.inputField}
                />

                <Select
                    fullWidth
                    name="statusId"
                    value={moduleData.statusId}
                    onChange={handleChange}
                    style={styles.selectField}
                >
                    {statusOptions.map(status => (
                        <MenuItem key={status._id} value={status._id}>{status.name}</MenuItem>
                    ))}
                </Select>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    style={styles.button}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : moduleId ? "Update Module" : "Add Module"}
                </Button>
            </Paper>
            <ToastContainer />
        </div>
    );
};

// ** Styles **
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
        overflowX: "hidden",
        overflowY: "auto",
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
        transition: "background-color 0.3s",
        marginRight: "10px",
        padding: "10px 20px",
        display: "block",
        marginTop: "10px"
    },
    selectField: {
        width: "100%",
        marginBottom: "15px",
    },
};

export default AddModuleForm;
