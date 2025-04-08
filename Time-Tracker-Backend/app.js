const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // To accept data as JSON

// Import Role routes
const roleRoutes = require("./src/routes/RoleRoutes");
app.use(roleRoutes);

// Import User routes
const userRoutes = require("./src/routes/UserRoutes");
app.use(userRoutes);

// Import Project routes
const projectRoutes = require("./src/routes/ProjectRoutes");
app.use(projectRoutes);

// Import Project Team routes
const projectTeamRoutes = require("./src/routes/ProjectTeamRoutes");
app.use(projectTeamRoutes);

// Import Status routes
const statusRoutes = require("./src/routes/StatusRoutes");
app.use(statusRoutes);

// Import Project Module routes
const projectModuleRoutes = require("./src/routes/ProjectModuleRoutes");
app.use(projectModuleRoutes);

// Import Task routes
const taskRoutes = require("./src/routes/TaskRoutes");
app.use(taskRoutes);

// Import User Task routes
const userTaskRoutes = require("./src/routes/UserTaskRoutes");
app.use(userTaskRoutes);

// Import Time Log routes
const timeLogRoutes = require("./src/routes/TimeLogRoutes");
app.use(timeLogRoutes);

// Import Billing routes
const billingRoutes = require("./src/routes/BillingRoutes");
app.use(billingRoutes);

// Import Reports routes
const reportsRoutes = require("./src/routes/ReportsRoutes");
app.use(reportsRoutes);

// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/Time_Tracker_Database")
    .then(() => {
        console.log("Database connected....");
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });

// Server Creation
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server started on port number", PORT);
});
