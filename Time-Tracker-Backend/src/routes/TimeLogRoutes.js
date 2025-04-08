const routes = require("express").Router();
const timeLogController = require("../controllers/TimeLogController");

routes.post("/time-logs/add", timeLogController.addTimeLog);

routes.get("/time-logs", timeLogController.getTimeLogs);

routes.delete("/time-logs/:id", timeLogController.deleteTimeLog);

module.exports = routes;
