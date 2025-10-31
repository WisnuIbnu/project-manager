import { Router } from "express";
import { createTaskController, deleteTaskController, updateTaskController } from "../controllers/task.controller";

const taskRoutes = Router();

taskRoutes.post("/project/:projectId/workspace/:workspaceId/create", createTaskController);
taskRoutes.put("/:id/project/:projectId/workspace/:workspaceId/update", updateTaskController);
taskRoutes.delete("/:id/project/:projectId/workspace/:workspaceId/delete", deleteTaskController);

export default taskRoutes;