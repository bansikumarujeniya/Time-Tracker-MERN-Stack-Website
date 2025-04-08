const routes = require("express").Router();
const projectTeamController = require("../controllers/ProjectTeamController");

routes.get("/project-teams", projectTeamController.getAllProjectTeams);
routes.post("/project-teams", projectTeamController.addProjectTeam);
routes.delete("/project-teams/:id", projectTeamController.deleteProjectTeam);
routes.get("/project-teams/:id", projectTeamController.getProjectTeamById);

module.exports = routes;
