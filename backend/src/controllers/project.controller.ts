import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createProjectSchema, updateProjectSchema } from "../validation/project.validation";
import { projectIdSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import roleGuard from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";
import { 
  createProjectByWorkspaceIdService, deleteProjectService, getAllProjectInWorkspaceService, getProjectAnalyticsService, getProjectByIdAndWorkspaceService, updateProjectByIdService } from "../services/project.service";
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

  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const pageNumber = parseInt(req.query.pageNumber as string) || 1;  
  

  const { Projects, totalCount, totalPage, skip  } = await getAllProjectInWorkspaceService(
    userId, 
    workspaceId,
    pageNumber,
    pageSize,
  );
 
  return res.status(HTTPSTATUS.OK).json({
    message: "All of project's workspace retrieved successfully",
    Projects,
    pagination: {
      totalCount,
      pageSize,
      pageNumber,
      totalPage,
      skip,
      limit: pageSize,
    }
  })
});

export const getProjectByIdAndWorkspaceIdController = asyncHandler(async(req: Request, res:Response) => {
  const projectId = projectIdSchema.parse(req.params.id);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user?._id;

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId); 
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const { project } = await getProjectByIdAndWorkspaceService(
    projectId,
    workspaceId,
  )

    return res.status(HTTPSTATUS.OK).json({
    message: "Project retrieved  successfully",
    project,
  })
});

export const getProjectAnalyticsController = asyncHandler(async(req: Request, res: Response) => {
  const projectId = projectIdSchema.parse(req.params.id);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const userId = req.user?._id;

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const { analytics } = await getProjectAnalyticsService(projectId, workspaceId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Project Analytics retrieved",
    analytics
  })
});

export const updateProjectInWorkspaceController = asyncHandler(async(req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const projectId = projectIdSchema.parse(req.params.id);

  const body = updateProjectSchema.parse(req.body);
  const userId = req.user?._id;


  const { role } = await getMemberRoleInWorkspace(userId, workspaceId); 
  roleGuard(role, [Permissions.EDIT_PROJECT]);

  const { project } = await updateProjectByIdService(
    projectId,
    workspaceId,
    body,
  );

  return res.status(HTTPSTATUS.OK).json({
    message: "Project update successfully",
    project,
  })
});

export const deleteProjectController = asyncHandler(async(req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const projectId = projectIdSchema.parse(req.params.id);

  const userId = req.user?._id;


  const { role } = await getMemberRoleInWorkspace(userId, workspaceId); 
  roleGuard(role, [Permissions.DELETE_PROJECT]);

  await deleteProjectService(workspaceId, projectId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Project delete successfully"
  })
})