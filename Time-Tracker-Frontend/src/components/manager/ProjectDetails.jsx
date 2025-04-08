import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Typography, Paper, TextField, Button, MenuItem, Select } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [statusOptions, setStatusOptions] = useState([
        { _id: "67d003e6805518892ba6eaa2", name: "In Progress" },
        { _id: "67d00431805518892ba6eaa4", name: "Completed" },
        { _id: "67d0044c805518892ba6eaa6", name: "Pending" }
    ]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/projects/${id}`);
                if (response.data && response.data.data) {
                    setProject(response.data.data);
                    setFormData({
                        ...response.data.data,
                        startDate: formatDateForInput(response.data.data.startDate),
                        completionDate: formatDateForInput(response.data.data.completionDate),
                        statusId: response.data.data.statusId?._id || "67d003e6805518892ba6eaa2"
                    });
                }
            } catch (error) {
                console.error("Error fetching project details:", error.response?.data || error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    
    const formatDateForInput = (dateString) => {
        if (!dateString) return ""; 
        return new Date(dateString).toISOString().split("T")[0]; 
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3000/projects/${id}`, formData);
            setProject(formData);
            setEditMode(false);
            toast.success("Project updated successfully!", { position: "top-center", autoClose: 2000 });
            setTimeout(() => navigate("/manager/projectlist"), 2000);
        } catch (error) {
            console.error("Error updating project:", error.response?.data || error);
            toast.error("Error updating project.", { position: "top-center" });
        }
    };

    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
    if (!project) return <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>Project not found.</Typography>;

    return (
        <div style={styles.container}>
            <Paper style={styles.tableContainer}>
                <Typography variant="h4" style={styles.heading}>
                    {editMode ? (
                        <TextField fullWidth name="title" value={formData.title} onChange={handleChange} />
                    ) : (
                        project.title
                    )}
                </Typography>

                <TextField
                    label="Description"
                    fullWidth
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    margin="normal"
                    disabled={!editMode}
                />

                <TextField
                    label="Technology"
                    fullWidth
                    name="technology"
                    value={formData.technology}
                    onChange={handleChange}
                    margin="normal"
                    disabled={!editMode}
                />

                <TextField
                    label="Estimated Hours"
                    fullWidth
                    name="estimatedHours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={handleChange}
                    margin="normal"
                    disabled={!editMode}
                />

                <TextField
                    label="Start Date"
                    fullWidth
                    name="startDate"
                    type="date"
                    value={formData.startDate} 
                    onChange={handleChange}
                    margin="normal"
                    disabled={!editMode}
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Completion Date"
                    fullWidth
                    name="completionDate"
                    type="date"
                    value={formData.completionDate} 
                    onChange={handleChange}
                    margin="normal"
                    disabled={!editMode}
                    InputLabelProps={{ shrink: true }}
                />

                <Typography variant="body1" sx={{ mt: 2 }}>
                    <b>Status:</b> {editMode ? (
                        <Select
                            fullWidth
                            name="statusId"
                            value={formData.statusId}
                            onChange={handleChange}
                        >
                            {statusOptions.map((status) => (
                                <MenuItem key={status._id} value={status._id}>{status.name}</MenuItem>
                            ))}
                        </Select>
                    ) : (
                        statusOptions.find(s => s._id === project.statusId?._id)?.name || "Unknown"
                    )}
                </Typography>

                <div style={{ marginTop: "20px" }}>
                    {editMode ? (
                        <>
                            <Button variant="contained" onClick={handleUpdate} style={styles.button}>Save</Button>
                            <Button variant="outlined" onClick={() => setEditMode(false)}>Cancel</Button>
                        </>
                    ) : (
                        <Button variant="contained" onClick={() => setEditMode(true)} style={styles.button}>Edit Project</Button>
                    )}
                </div>
            </Paper>
            <ToastContainer />
        </div>
    );
};

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
    tableContainer: {
        flex: 1,
        width: "100%",
        maxWidth: "calc(100vw - 20px)",
        borderRadius: "10px",
        boxShadow: 3,
        overflowX: "hidden",
        overflowY: "auto",
        padding: "20px"
    },
    heading: {
        textAlign: "center",
        fontWeight: "bold",
        padding: "10px",
    },
    button: {
        backgroundColor: '#D0DDD0',
        color: '#333',
        borderRadius: "5px",
        transition: "background-color 0.3s",
        marginRight: "10px"
    }
};

export default ProjectDetails;
