import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Select, MenuItem, IconButton, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("All");
  const [editedRoles, setEditedRoles] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      const allUsers = res.data?.data || [];

      const nonAdmins = allUsers.filter(user => user.roleId?.name !== "Admin");
      setUsers(nonAdmins);
      setFilteredUsers(nonAdmins);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleFilterChange = (e) => {
    const role = e.target.value;
    setRoleFilter(role);

    if (role === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.roleId?.name === role));
    }
  };

  const handleRoleChange = (userId, newRoleId) => {
    setEditedRoles(prev => ({ ...prev, [userId]: newRoleId }));
  };

  const handleUpdateRole = async (userId) => {
    const roleId = editedRoles[userId];
    if (!roleId) return;

    try {
      await axios.put(`http://localhost:3000/users/${userId}`, { roleId });
      toast.success("✅ Role updated successfully", { position: "top-center" });
      fetchUsers();
      setEditedRoles(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (err) {
      console.error("❌ Error updating role:", err);
      toast.error("❌ Failed to update role", { position: "top-center" });
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5A6E58",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/users/${userId}`);
        toast.success("✅ User deleted", { position: "top-center" });
        fetchUsers();
      } catch (err) {
        console.error("❌ Error deleting user:", err);
        toast.error("❌ Failed to delete user", { position: "top-center" });
      }
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Typography variant="h5" style={styles.heading}>
          User Management
        </Typography>

        <Select
          value={roleFilter}
          onChange={handleRoleFilterChange}
          style={styles.select}
        >
          <MenuItem value="All">All Roles</MenuItem>
          <MenuItem value="Project Manager">Project Manager</MenuItem>
          <MenuItem value="Developer">Developer</MenuItem>
        </Select>

        {loading ? (
          <CircularProgress style={styles.loader} />
        ) : filteredUsers.length === 0 ? (
          <Typography style={styles.noData}>No users available.</Typography>
        ) : (
          <Table style={styles.table}>
            <TableHead style={styles.tableHeader}>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Update</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => {
                const currentRole = editedRoles[user._id] || user.roleId?._id || "";

                return (
                  <TableRow key={user._id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={currentRole}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        style={styles.roleSelect}
                      >
                        <MenuItem value="67c2d7307c5ffa0ab7fd4b3a">Developer</MenuItem>
                        <MenuItem value="67c2d70e7c5ffa0ab7fd4b38">Project Manager</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleUpdateRole(user._id)}
                        style={styles.updateButton}
                      >
                        Update
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteUser(user._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
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
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: "10px",
    color: "#5A6E58",
  },
  loader: {
    display: "block",
    margin: "30px auto",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    color: "gray",
  },
  select: {
    marginBottom: "15px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: "8px 12px",
  },
  roleSelect: {
    backgroundColor: "#fff",
    borderRadius: "5px",
    width: "100%",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
  },
  tableHeader: {
    backgroundColor: "#D0DDD0",
  },
  updateButton: {
    backgroundColor: "#5A6E58",
    color: "#fff",
    textTransform: "none",
    padding: "5px 10px",
  },
};

export default AdminUserManagement;
