import { Router } from "express";
import { createTaskController, deleteTaskController, getAllTasksController, updateTaskController } from "../controllers/task.controller";

const taskRoutes = Router();

taskRoutes.post("/project/:projectId/workspace/:workspaceId/create", createTaskController);
taskRoutes.put("/:id/project/:projectId/workspace/:workspaceId/update", updateTaskController);
taskRoutes.get("/workspace/:workspaceId/all", getAllTasksController);
taskRoutes.delete("/:id/project/:projectId/workspace/:workspaceId/delete", deleteTaskController);

export default taskRoutes;