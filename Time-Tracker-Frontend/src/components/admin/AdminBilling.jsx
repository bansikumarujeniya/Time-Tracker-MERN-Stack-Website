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
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";

const AdminBilling = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [billingForm, setBillingForm] = useState({
    userId: "",
    projectId: "",
    hourlyPrice: "",
    payment: "Pending",
  });

  useEffect(() => {
    fetchBillings();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchBillings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/billings");
      setBillings(res.data?.data || []);
    } catch (err) {
      toast.error("❌ Failed to fetch billings", { position: "top-center" });
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
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/billings/add", billingForm);
      toast.success("✅ Billing added successfully", { position: "top-center" });
      fetchBillings();
      setBillingForm({ userId: "", projectId: "", hourlyPrice: "", payment: "Pending" });
    } catch (err) {
      toast.error("❌ Failed to add billing", { position: "top-center" });
    }
  };

  const generateBillingPDF = (bill) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      let yPos = margin + 10;

      // Add page border
      doc.setDrawColor(90, 110, 88); // #5A6E58
      doc.setLineWidth(0.5);
      doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

      // Load logo image
      const img = new Image();
      img.src = "/timer.png"; // Ensure this path is correct

      // Header with logo and text
      doc.setFontSize(18);
      doc.setTextColor(90, 110, 88); // #5A6E58
      const headerText = "Time Tracker";
      const textWidth = doc.getTextWidth(headerText);
      const logoSize = 18;
      const totalWidth = logoSize + textWidth + 5;
      const xPos = (pageWidth - totalWidth) / 2;

      doc.addImage(img, "PNG", xPos, yPos, logoSize, logoSize);
      doc.text(headerText, xPos + logoSize + 5, yPos + 14);
      yPos += logoSize + 15;

      // Billing details with consistent font size and bold labels
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Developer:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${bill.userId?.firstName || "Unknown"} ${bill.userId?.lastName || "User"}`, 50, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Project:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${bill.projectId?.title || "Unknown"}`, 50, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Total Hours:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${bill.totalHour || 0} hrs`, 50, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Hourly Price:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`Rs. ${bill.hourlyPrice || 0}`, 50, yPos); 
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Total Amount:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`Rs. ${bill.totalAmount || 0}`, 50, yPos); 
      yPos += 15;

      doc.setFont("helvetica", "bold");
      doc.text("Payment Status:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${bill.payment || "Unknown"}`, 50, yPos);
      yPos += 15;

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(90, 110, 88); 
      const footerText = "Thank You For Using Time Tracker";
      const footerWidth = doc.getTextWidth(footerText);
      const footerXPos = (pageWidth - footerWidth) / 2;
      doc.text(footerText, footerXPos, pageHeight - margin - 5);

      const username = `${bill.userId?.firstName || "Unknown"}_${bill.userId?.lastName || "User"}`;
      doc.save(`Billing_${username}.pdf`);

      // Add success toast notification
      toast.success("✅ PDF downloaded successfully", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("❌ Failed to generate PDF", { position: "top-center" });
    }
  };

  const developers = users.filter((user) => user.roleId?.name === "Developer");

  return (
    <div style={styles.container}>
      <ToastContainer />
      <Typography variant="h5" style={styles.heading}>Admin Billing Dashboard</Typography>

      <div style={styles.section}>
        <Typography variant="h6" style={styles.heading}>Add Billing</Typography>
        <form onSubmit={handleBillingSubmit} style={styles.form}>
          <FormControl fullWidth style={styles.formField}>
            <InputLabel>Developer</InputLabel>
            <Select
              value={billingForm.userId}
              onChange={(e) => setBillingForm({ ...billingForm, userId: e.target.value })}
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
              value={billingForm.projectId}
              onChange={(e) => setBillingForm({ ...billingForm, projectId: e.target.value })}
              required
            >
              <MenuItem value="">Select Project</MenuItem>
              {projects.map((proj) => (
                <MenuItem key={proj._id} value={proj._id}>{proj.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Hourly Price"
            type="number"
            value={billingForm.hourlyPrice}
            onChange={(e) => setBillingForm({ ...billingForm, hourlyPrice: e.target.value })}
            fullWidth
            style={styles.formField}
            required
          />
          <FormControl fullWidth style={styles.formField}>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={billingForm.payment}
              onChange={(e) => setBillingForm({ ...billingForm, payment: e.target.value })}
              required
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            style={{ ...styles.submitButton, backgroundColor: "#5A6E58", color: "#fff" }}
          >
            Add Billing
          </Button>
        </form>

        <div style={styles.spacer} />

        <TableContainer component={Paper} style={styles.tableContainer}>
          <Typography variant="h6" style={styles.heading}>Billing Overview</Typography>
          {loading ? <CircularProgress style={styles.loader} /> : (
            <Table style={styles.table}>
              <TableHead style={styles.tableHeader}>
                <TableRow>
                  <TableCell><b>Developer</b></TableCell>
                  <TableCell><b>Project</b></TableCell>
                  <TableCell><b>Total Hours</b></TableCell>
                  <TableCell><b>Hourly Price</b></TableCell>
                  <TableCell><b>Total Amount</b></TableCell>
                  <TableCell><b>Payment Status</b></TableCell>
                  <TableCell><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billings.map((bill) => (
                  <TableRow key={bill._id}>
                    <TableCell>{bill.userId?.firstName} {bill.userId?.lastName}</TableCell>
                    <TableCell>{bill.projectId?.title}</TableCell>
                    <TableCell>{bill.totalHour} hrs</TableCell>
                    <TableCell>₹{bill.hourlyPrice}</TableCell>
                    <TableCell>₹{bill.totalAmount}</TableCell>
                    <TableCell>{bill.payment}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => generateBillingPDF(bill)}
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

export default AdminBilling;