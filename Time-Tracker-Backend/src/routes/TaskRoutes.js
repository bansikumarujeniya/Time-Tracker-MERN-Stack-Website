const express = require("express");
const routes = express.Router();
const taskController = require("../controllers/TaskController");

routes.get("/tasks", taskController.getAllTasks);
routes.get("/tasks/module/:moduleId", taskController.getTasksByModule);
routes.post("/tasks", taskController.addTask);
routes.delete("/tasks/:id", taskController.deleteTask);
routes.put("/tasks/:id", taskController.updateTask);
routes.get("/tasks/:id", taskController.getTaskById);

module.exports = routes;

