const express = require("express");
const router = express.Router();
const UserTaskController = require("../controllers/UserTaskController");

router.post("/user-tasks", UserTaskController.addUserTask);
router.get("/user-tasks", UserTaskController.getUserTasks);
router.get("/user-tasks/:userId", UserTaskController.getUserTasksByUser);
router.delete("/user-tasks/:id", UserTaskController.deleteUserTask);
router.put("/user-tasks/:id", UserTaskController.updateUserTask);
router.get("/user-tasks/single/:id", UserTaskController.getUserTaskById);

module.exports = router;
