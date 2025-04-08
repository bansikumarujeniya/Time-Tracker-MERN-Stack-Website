const routes = require("express").Router();
const billingController = require("../controllers/BillingController");

routes.post("/billings/add", billingController.addBilling);
routes.get("/billings", billingController.getBillings);

module.exports = routes;
