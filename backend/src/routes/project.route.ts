import { Router } from "express";
import { createProjectByWorkspaceIdController, getAllProjectInWorkspaceController, getProjectAnalyticsController, getProjectByIdAndWorkspaceIdController, updateProjectInWorkspaceController } from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectByWorkspaceIdController);
projectRoutes.get("/workspace/:workspaceId/all", getAllProjectInWorkspaceController);
projectRoutes.get("/:id/workspace/:workspaceId", getProjectByIdAndWorkspaceIdController);
projectRoutes.get("/:id/workspace/:workspaceId/analytics", getProjectAnalyticsController);

projectRoutes.put("/:id/workspace/:workspaceId/update", updateProjectInWorkspaceController);

export default projectRoutes;