import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const DeveloperTimeLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (userId) {
      fetchLogs();
    }
  }, [userId]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/time-logs");
      const allLogs = res.data?.data || [];

      const userLogs = allLogs.filter((log) => log.userId?._id === userId);
      setLogs(userLogs);
    } catch (err) {
      console.error("❌ Error fetching time logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTimeWithAMPM = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, 
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div style={styles.container}>
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Typography variant="h5" style={styles.heading}>
          Time Log History
        </Typography>

        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : logs.length === 0 ? (
          <Typography variant="h6" style={styles.noData}>
            No time logs available.
          </Typography>
        ) : (
          <Table style={styles.table}>
            <TableHead style={styles.tableHeader}>
              <TableRow>
                <TableCell><b>Task</b></TableCell>
                <TableCell><b>Project</b></TableCell>
                <TableCell><b>Start Date</b></TableCell>
                <TableCell><b>End Date</b></TableCell>
                <TableCell><b>Total Minutes</b></TableCell>
                <TableCell><b>Logged On</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => {
                const task = log.taskId;
                const module = task?.moduleId;

                const taskDisplay = task
                  ? `${task.title || "Untitled"} (${task.description || "No Description"})`
                  : "Unknown Task";

                return (
                  <TableRow key={log._id}>
                    <TableCell>{taskDisplay}</TableCell>
                    <TableCell>{module?.moduleName || "Unknown Project"}</TableCell>
                    <TableCell>{formatDateTimeWithAMPM(log.startDate)}</TableCell>
                    <TableCell>{log.endDate ? formatDateTimeWithAMPM(log.endDate) : "-"}</TableCell>
                    <TableCell>{log.totalMin ?? 0} min</TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                  </TableRow>
                );
              })}
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
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "20px",
    overflowX: "hidden",
  },
  tableContainer: {
    flex: 1,
    width: "100%",
    maxWidth: "calc(100vw - 40px)",
    padding: "20px",
    backgroundColor: "#AAB99A",
    borderRadius: "10px",
  },
  heading: {
    margin: "20px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#5A6E58",
  },
  loader: {
    display: "block",
    margin: "auto",
  },
  noData: {
    textAlign: "center",
    marginTop: "30px",
  },
  table: {
    tableLayout: "fixed",
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#D0DDD0",
  },
};

export default DeveloperTimeLogList;
