import { Router } from "express";
import { createProjectByWorkspaceIdController, getAllProjectInWorkspaceController } from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectByWorkspaceIdController);
projectRoutes.get("/workspace/:workspaceId/all", getAllProjectInWorkspaceController);
projectRoutes.put("/workspace/:workspaceId/update", updateProjectInWorkspaceController);

export default projectRoutes;