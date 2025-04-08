import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";

const AdminReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [developers, setDevelopers] = useState([]);

  const [reportForm, setReportForm] = useState({
    userId: "",
    projectId: "",
    taskId: "",
  });

  useEffect(() => {
    fetchReports();
    fetchProjects();
    fetchUsers();
    fetchTasks();
  }, []);

  useEffect(() => {
    if (reportForm.projectId) {
      const tasksForProject = allTasks.filter(
        (task) => task.projectId?._id === reportForm.projectId || task.projectId === reportForm.projectId
      );
      setFilteredTasks(tasksForProject);
    } else {
      setFilteredTasks([]);
    }
    setReportForm(prev => ({ ...prev, taskId: "" }));
  }, [reportForm.projectId, allTasks]);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/reports");
      setReports(res.data?.data || []);
    } catch (err) {
      toast.error("❌ Failed to fetch reports", { position: "top-center" });
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

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      const allUsers = res.data?.data || [];
      setUsers(allUsers);
      const devList = allUsers.filter(
        (user) => user.roleId === "67c2d7307c5ffa0ab7fd4b3a" || 
                 (user.roleId && user.roleId._id === "67c2d7307c5ffa0ab7fd4b3a")
      );
      setDevelopers(devList);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      toast.error("❌ Failed to fetch users", { position: "top-center" });
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/tasks");
      setAllTasks(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/reports/generate", reportForm);
      toast.success("✅ Report generated successfully", { position: "top-center" });
      fetchReports();
      setReportForm({ userId: "", projectId: "", taskId: "" });
    } catch (err) {
      toast.error("❌ Failed to generate report", { position: "top-center" });
    }
  };

  const generateReportPDF = (report) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      let yPos = margin + 10;

      doc.setDrawColor(90, 110, 88);
      doc.setLineWidth(0.5);
      doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

      const img = new Image();
      img.src = "/timer.png";

      doc.setFontSize(18);
      doc.setTextColor(90, 110, 88);
      const headerText = "Time Tracker";
      const textWidth = doc.getTextWidth(headerText);
      const logoSize = 18;
      const totalWidth = logoSize + textWidth + 5;
      const xPos = (pageWidth - totalWidth) / 2;

      doc.addImage(img, "PNG", xPos, yPos, logoSize, logoSize);
      doc.text(headerText, xPos + logoSize + 5, yPos + 14);
      yPos += logoSize + 15;

      doc.setFontSize(12);
      const lineSpacing = 10;

      doc.setFont("helvetica", "bold");
      doc.text("Developer:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${report.userId?.firstName || "Unknown"} ${report.userId?.lastName || "User"}`, 50, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text("Email:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${report.userId?.email || "-"}`, 50, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text("Project:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${report.projectId?.title || "Unknown"}`, 50, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text("Descrption:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${report.projectId?.description || "-"}`, 50, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text("Task:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${report.taskId?.title || "Unknown"}`, 50, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text("Task Description:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${report.taskId?.description || "-"}`, 50, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text("Total Hours:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${report.totalHour || 0} hrs`, 50, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text("Productivity:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${report.productivity || "-"}%`, 50, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text("Generated Date:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${new Date(report.generatedDate).toLocaleDateString("en-GB")}`, 50, yPos);
      yPos += lineSpacing + 10;

      doc.setFontSize(10);
      doc.setTextColor(90, 110, 88);
      const footerText = "Thank You For Using Time Tracker";
      const footerWidth = doc.getTextWidth(footerText);
      const footerXPos = (pageWidth - footerWidth) / 2;
      doc.text(footerText, footerXPos, pageHeight - margin - 5);

      const username = `${report.userId?.firstName || "Unknown"}_${report.userId?.lastName || "User"}`;
      doc.save(`Report_${username}.pdf`);
      
      toast.success("✅ PDF downloaded successfully", { 
        position: "top-center",
        autoClose: 3000 
      });
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("❌ Failed to generate PDF", { position: "top-center" });
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <Typography variant="h5" style={styles.heading}>Admin Report Dashboard</Typography>

      <div style={styles.section}>
        <Typography variant="h6" style={styles.heading}>Generate Report</Typography>
        <form onSubmit={handleReportSubmit} style={styles.form}>
          <FormControl fullWidth style={styles.formField}>
            <InputLabel>Developer</InputLabel>
            <Select
              value={reportForm.userId}
              onChange={(e) => setReportForm({ ...reportForm, userId: e.target.value })}
              required
            >
              <MenuItem value="">Select Developer</MenuItem>
              {developers.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={styles.formField}>
            <InputLabel>Project</InputLabel>
            <Select
              value={reportForm.projectId}
              onChange={(e) => setReportForm({ ...reportForm, projectId: e.target.value })}
              required
            >
              <MenuItem value="">Select Project</MenuItem>
              {projects.map((proj) => (
                <MenuItem key={proj._id} value={proj._id}>{proj.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={styles.formField}>
            <InputLabel>Task</InputLabel>
            <Select
              value={reportForm.taskId}
              onChange={(e) => setReportForm({ ...reportForm, taskId: e.target.value })}
              required
              disabled={!reportForm.projectId}
            >
              <MenuItem value="">Select Task</MenuItem>
              {filteredTasks.map((task) => (
                <MenuItem key={task._id} value={task._id}>
                  {task.title} ({task.description || "-"})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            style={{ ...styles.submitButton, backgroundColor: "#5A6E58", color: "#fff" }}
          >
            Generate Report
          </Button>
        </form>

        <div style={styles.spacer} />

        <TableContainer component={Paper} style={styles.tableContainer}>
          <Typography variant="h6" style={styles.heading}>Report Overview</Typography>
          {loading ? <CircularProgress style={styles.loader} /> : (
            <Table style={styles.table}>
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell><b>Developer</b></TableCell>
                  <TableCell><b>Project</b></TableCell>
                  <TableCell><b>Task</b></TableCell>
                  <TableCell><b>Total Hours</b></TableCell>
                  <TableCell><b>Productivity %</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{r.userId?.firstName} {r.userId?.lastName}</TableCell>
                    <TableCell>{r.projectId?.title}</TableCell>
                    <TableCell>{r.taskId?.title} ({r.taskId?.description || "-"})</TableCell>
                    <TableCell>{r.totalHour} hrs</TableCell>
                    <TableCell>{r.productivity ?? "-"}</TableCell>
                    <TableCell>{new Date(r.generatedDate).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => generateReportPDF(r)}
                        style={{ backgroundColor: "#D0DDD0", color: "#5A6E58" }}
                      >
                        Download PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </div>
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
  section: {
    width: "100%",
    marginTop: "20px",
  },
  form: {
    width: "100%",
    maxWidth: "calc(100vw - 40px)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    margin: "0 auto",
    backgroundColor: "#AAB99A",
    padding: "20px",
    borderRadius: "10px",
  },
  formField: {
    backgroundColor: "#fff",
    borderRadius: "5px",
  },
  submitButton: {
    marginTop: "10px",
  },
  spacer: {
    height: "20px",
  },
};

export default AdminReport;