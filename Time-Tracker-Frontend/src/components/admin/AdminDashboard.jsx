import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Paper,
    Typography,
    Grid,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#5A6E58", "#D0DDD0", "#AAB99A", "#8884d8"];

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        projects: 0,
        modules: 0,
        tasks: 0,
        logs: 0,
        logMinutes: 0,
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [timeChartData, setTimeChartData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [users, projects, modules, tasks, logs] = await Promise.all([
                axios.get("http://localhost:3000/users"),
                axios.get("http://localhost:3000/projects"),
                axios.get("http://localhost:3000/project-modules"),
                axios.get("http://localhost:3000/tasks"),
                axios.get("http://localhost:3000/time-logs"),
            ]);

            const userList = users?.data?.data || [];
            const nonAdminUsers = userList.filter((u) => u.roleId?.name !== "Admin");


            const roleMap = {};
            nonAdminUsers.forEach((user) => {
                const roleName = user.roleId?.name;
                if (roleName === "Developer" || roleName === "Project Manager") {
                    roleMap[roleName] = (roleMap[roleName] || 0) + 1;
                }
            });

            const roleBreakdown = Object.entries(roleMap).map(([role, value]) => ({
                role,
                value,
            }));
            setRoleData(roleBreakdown);

            const totalMinutes = logs?.data?.data?.reduce((sum, log) => sum + (log.totalMin || 0), 0);

            setStats({
                users: nonAdminUsers.length,
                projects: projects?.data?.data?.length || 0,
                modules: modules?.data?.data?.length || 0,
                tasks: tasks?.data?.data?.length || 0,
                logs: logs?.data?.data?.length || 0,
                logMinutes: totalMinutes,
            });

            setRecentUsers(nonAdminUsers.slice(-5).reverse());

            const chartData = logs?.data?.data?.slice(-7).map((log) => ({
                date: new Date(log.createdAt).toLocaleDateString("en-GB"),
                minutes: log.totalMin || 0,
            })) || [];
            setTimeChartData(chartData);
        } catch (error) {
            console.error("❌ Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const summaryData = [
        { label: "Users", value: stats.users },
        { label: "Projects", value: stats.projects },
        { label: "Modules", value: stats.modules },
        { label: "Tasks", value: stats.tasks },
        { label: "Logged Minutes", value: stats.logMinutes },
    ];

    return (
        <div style={styles.container}>
            <Typography variant="h4" style={styles.heading}>Admin Dashboard</Typography>

            {loading ? (
                <CircularProgress style={styles.loader} />
            ) : (
                <>
                    <Grid container spacing={3}>
                        {summaryData.map((item, i) => (
                            <Grid item xs={12} sm={6} md={2.4} key={i}>
                                <Paper style={styles.card}>
                                    <Typography variant="subtitle2" style={styles.cardLabel}>{item.label}</Typography>
                                    <Typography variant="h5" style={styles.cardValue}>{item.value}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3} style={{ marginTop: "30px" }}>
                        <Grid item xs={12} md={6}>
                            <Paper style={styles.chartCard}>
                                <Typography variant="subtitle1" style={styles.chartTitle}>Overview Distribution</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={summaryData}
                                            dataKey="value"
                                            nameKey="label"
                                            outerRadius={80}
                                            label
                                        >
                                            {summaryData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper style={styles.chartCard}>
                                <Typography variant="subtitle1" style={styles.chartTitle}>Summary Breakdown</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={summaryData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="label" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#5A6E58" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper style={styles.chartCard}>
                                <Typography variant="subtitle1" style={styles.chartTitle}>Time Log Trends (Last 7)</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={timeChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="minutes" fill="#AAB99A" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper style={styles.chartCard}>
                                <Typography variant="subtitle1" style={styles.chartTitle}>Role-wise Analytics</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={roleData}
                                            dataKey="value"
                                            nameKey="role"
                                            outerRadius={80}
                                            label
                                        >
                                            {roleData.map((entry, i) => (
                                                <Cell
                                                    key={`cell-${i}`}
                                                    fill={
                                                        entry.role === "Project Manager"
                                                            ? "#AAB99A"
                                                            : "#5A6E58" 
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper style={styles.chartCard}>
                                <Typography variant="subtitle1" style={styles.chartTitle}>Recent Users</Typography>
                                <List dense>
                                    {recentUsers.map((user) => (
                                        <React.Fragment key={user._id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={`${user.firstName} ${user.lastName}`}
                                                    secondary={user.email}
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#F7F9F7",
    },
    heading: {
        textAlign: "center",
        color: "#5A6E58",
        fontWeight: "bold",
        marginBottom: "30px",
    },
    loader: {
        display: "block",
        margin: "auto",
    },
    card: {
        padding: "20px",
        backgroundColor: "#AAB99A",
        borderRadius: "12px",
        textAlign: "center",
        height: "100%",
    },
    cardLabel: {
        fontWeight: "bold",
        color: "#fff",
    },
    cardValue: {
        color: "#fff",
        fontSize: "1.8rem",
        fontWeight: "bold",
    },
    chartCard: {
        padding: "20px",
        backgroundColor: "#D0DDD0",
        borderRadius: "12px",
        height: "100%",
    },
    chartTitle: {
        textAlign: "center",
        color: "#333",
        fontWeight: 600,
        marginBottom: "10px",
    },
};

export default AdminDashboard;
