const routes = require("express").Router();

// controller --> userController
const userController = require("../controllers/UserController");

// GET all users
routes.get("/users", userController.getAllUsers);


routes.get("/users/:id", userController.getUserByID);


routes.post("/users", userController.addUser);


routes.delete("/users/:id", userController.deleteUser);


routes.put("/users/:id", userController.updateUserRole);

routes.post("/users/signup", userController.signup);
routes.post("/users/login", userController.loginUser);
routes.post("/users/forgotpassword", userController.forgotPassword);
routes.post("/users/resetpassword", userController.resetpassword);

module.exports = routes;
