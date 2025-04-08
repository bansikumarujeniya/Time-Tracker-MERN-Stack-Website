import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, CircularProgress, Button, Select, MenuItem
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskAssignment = () => {
    const [modules, setModules] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDeveloper, setSelectedDeveloper] = useState({});

    useEffect(() => {
        fetchModulesWithTasks();
        fetchDevelopers();
    }, []);

    const fetchModulesWithTasks = async () => {
        try {
            const response = await axios.get("http://localhost:3000/project-modules");
            const modulesData = response.data?.data || [];
            setModules(modulesData);

            const allTasks = await Promise.all(
                modulesData.map(module =>
                    axios.get(`http://localhost:3000/tasks/module/${module._id}`)
                        .then(res => ({
                            moduleName: module.moduleName,
                            moduleId: module._id,
                            tasks: res.data.data || []
                        }))
                        .catch(() => ({
                            moduleName: module.moduleName,
                            moduleId: module._id,
                            tasks: []
                        }))
                )
            );

            setTasks(allTasks);
        } catch (error) {
            console.error("❌ Error fetching modules:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDevelopers = async () => {
        try {
            const res = await axios.get("http://localhost:3000/users?role=Developer");
            const filtered = (res.data?.data || []).filter(
                dev => dev.roleId?.name === "Developer"
            );
            setDevelopers(filtered);
        } catch (err) {
            console.error("Error fetching developers:", err);
        }
    };

    const handleBulkAssign = async (module) => {
        const userId = selectedDeveloper[module.moduleId];
        if (!userId) {
            toast.warning("⚠️ Please select a developer first", { position: "top-center" });
            return;
        }

        const unassignedTasks = module.tasks.filter(task => !task.assignedTo);
        if (unassignedTasks.length === 0) {
            toast.info("⚠️ Tasks are already assigned", { position: "top-center", autoClose: 2000 });
            return;
        }

        try {
            await Promise.all(
                unassignedTasks.map(task =>
                    axios.post("http://localhost:3000/user-tasks", {
                        userId,
                        taskId: task._id,
                        logDate: new Date().toISOString(),
                        workedHr: 0
                    })
                )
            );
            toast.success("✅ Task Assigned Successfully", { position: "top-center", autoClose: 2000 });
            fetchModulesWithTasks();
        } catch (error) {
            console.error("❌ Error assigning tasks:", error);
            toast.error("❌ Assignment failed", { position: "top-center" });
        }
    };

    return (
        <div style={styles.container}>
            <TableContainer component={Paper} style={styles.tableContainer}>
                <Typography variant="h5" gutterBottom style={styles.heading}>
                    Task Assignment
                </Typography>

                {loading ? (
                    <CircularProgress style={styles.loader} />
                ) : tasks.length === 0 ? (
                    <Typography variant="h6" style={styles.noData}>
                        No tasks available.
                    </Typography>
                ) : (
                    <Table style={styles.table}>
                        <TableHead style={styles.tableHeader}>
                            <TableRow>
                                <TableCell><b>Module Name</b></TableCell>
                                <TableCell><b>Task Name</b></TableCell>
                                <TableCell><b>Description</b></TableCell>
                                <TableCell><b>Priority</b></TableCell>
                                <TableCell><b>Estimated Time</b></TableCell>
                                <TableCell><b>Assign</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((module, moduleIndex) => (
                                module.tasks.length > 0 && (
                                    <React.Fragment key={module.moduleId}>
                                        {module.tasks.map((task, taskIndex) => (
                                            <TableRow key={task._id} hover>
                                                {taskIndex === 0 && (
                                                    <TableCell
                                                        rowSpan={module.tasks.length}
                                                        style={styles.moduleCell}
                                                    >
                                                        {module.moduleName}
                                                    </TableCell>
                                                )}
                                                <TableCell>{task.title || "No Title"}</TableCell>
                                                <TableCell>{task.description || "No Description"}</TableCell>
                                                <TableCell>{task.priority || "N/A"}</TableCell>
                                                <TableCell>{task.totalMinute || "N/A"} min</TableCell>
                                                {taskIndex === 0 ? (
                                                    <TableCell rowSpan={module.tasks.length}>
                                                        <Select
                                                            value={selectedDeveloper[module.moduleId] || ""}
                                                            onChange={(e) =>
                                                                setSelectedDeveloper(prev => ({
                                                                    ...prev,
                                                                    [module.moduleId]: e.target.value
                                                                }))
                                                            }
                                                            fullWidth
                                                            style={styles.select}
                                                        >
                                                            <MenuItem value="">Select Developer</MenuItem>
                                                            {developers.map(dev => (
                                                                <MenuItem key={dev._id} value={dev._id}>
                                                                    {dev.firstName} {dev.lastName}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <Button
                                                            variant="contained"
                                                            style={styles.assignButton}
                                                            onClick={() => handleBulkAssign(module)}
                                                        >
                                                            Assign
                                                        </Button>
                                                    </TableCell>
                                                ) : null}
                                            </TableRow>
                                        ))}
                                        {moduleIndex !== tasks.length - 1 && (
                                            <TableRow>
                                                <TableCell colSpan={6} style={styles.moduleSeparator}>
                                                    <hr style={{ border: "1px solid white", margin: 0 }} />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                )
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <ToastContainer />
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
    moduleCell: {
        fontWeight: "bold",
        backgroundColor: "#AAB99A",
        verticalAlign: "top",
    },
    assignButton: {
        backgroundColor: "#5A6E58",
        color: "white",
        borderRadius: "8px",
        padding: "6px 12px",
        width: "100%",
        textTransform: "none",
        marginTop: "8px",
    },
    moduleSeparator: {
        padding: "0",
        backgroundColor: "#AAB99A",
    },
    select: {
        backgroundColor: "#fff",
        borderRadius: "5px",
    },
};

export default TaskAssignment;
