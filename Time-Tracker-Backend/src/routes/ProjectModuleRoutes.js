const routes = require("express").Router();
const projectModuleController = require("../controllers/ProjectModuleController");


routes.get("/project-modules", projectModuleController.getAllProjectModules);

routes.post("/project-modules", projectModuleController.addProjectModule);

routes.delete("/project-modules/:id", projectModuleController.deleteProjectModule);

routes.get("/project-modules/:id", projectModuleController.getProjectModuleById);

routes.put("/project-modules/:moduleId", projectModuleController.updateProjectModule);

routes.get("/project-modules/by-project/:projectId", projectModuleController.getModulesByProjectId);

module.exports = routes;
