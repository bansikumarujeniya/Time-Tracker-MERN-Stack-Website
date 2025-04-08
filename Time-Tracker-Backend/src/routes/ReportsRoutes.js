const routes = require("express").Router();
const reportsController = require("../controllers/ReportsController");

routes.post("/reports/generate", reportsController.generateReport);
routes.get("/reports", reportsController.getReports);

module.exports = routes;
