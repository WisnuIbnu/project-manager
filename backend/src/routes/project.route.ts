import { Router } from "express";
import { createProjectByWorkspaceIdController, getAllProjectInWorkspaceController, updateProjectInWorkspaceController } from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectByWorkspaceIdController);
projectRoutes.get("/workspace/:workspaceId/all", getAllProjectInWorkspaceController);
projectRoutes.put("/workspace/:workspaceId/:projectId/update", updateProjectInWorkspaceController);

export default projectRoutes;