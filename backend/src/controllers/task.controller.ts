import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { projectIdSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { createTaskSchema } from "../validation/task.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import roleGuard from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";
import { HTTPSTATUS } from "../config/http.config";
import { createTaskService } from "../services/task.service";

export const createTaskController = asyncHandler(async(req: Request, res: Response) => {
  const userId = req.user?._id;

  const body = createTaskSchema.parse(req.body);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const projectId = projectIdSchema.parse(req.params.projectId);

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.CREATE_TASK]);

  const { task } = await createTaskService(workspaceId, projectId, userId, body);

  return res.status(HTTPSTATUS.OK).json({
    message: "Create task successfully",
    task
  })
});