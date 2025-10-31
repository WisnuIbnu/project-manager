import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createProjectSchema, updateProjectSchema } from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import roleGuard from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";
import { createProjectByWorkspaceIdService, getAllProjectInWorkspaceService } from "../services/project.service";
import { HTTPSTATUS } from "../config/http.config";

export const createProjectByWorkspaceIdController = asyncHandler(async(req: Request, res: Response) => {
   const body = createProjectSchema.parse(req.body);

   const workspaceId = workspaceIdSchema.parse(req.params.workspaceId); 

   const userId = req.user?._id;
   const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
   roleGuard(role, [Permissions.CREATE_PROJECT]);

   const { project } = await createProjectByWorkspaceIdService(userId, workspaceId, body);

   return res.status(HTTPSTATUS.OK).json({
    message: "Project create successfully",
    project,
   })
});

export const getAllProjectInWorkspaceController = asyncHandler(async(req: Request, res: Response) =>{
 
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const userId = req.user?._id;
  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  
  const { allProjects } = await getAllProjectInWorkspaceService(userId, workspaceId);

  return res.status(HTTPSTATUS.OK).json({
    message: "All of project's workspace retrieved successfully",
    allProjects,
  })
});

export const updateProjectInWorkspaceController = asyncHandler(async(req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);

  const { emoji, name, description } = updateProjectSchema.parse(req.body);
  const userId = req.user?._id;

  

})