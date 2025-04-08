const routes = require("express").Router();
const statusController = require("../controllers/StatusController");

routes.get("/statuses", statusController.getAllStatuses);
routes.post("/statuses", statusController.addStatus);
routes.delete("/statuses/:id", statusController.deleteStatus);
routes.get("/statuses/:id", statusController.getStatusById);

module.exports = routes;
