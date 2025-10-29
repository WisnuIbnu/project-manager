import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { changeRolesSchema, createWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { HTTPSTATUS } from "../config/http.config";
import { changeMemberRoleService, createWorkspaceService, getAllWorkspaceUserIsMemberService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMembersService } from "../services/workspace.service";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { Permissions, PermissionsType } from "../enums/role.enum";
import roleGuard from "../utils/roleGuard";

export const createWorkspaceController = asyncHandler(async(req: Request, res: Response) => { 
  const body = createWorkspaceSchema.parse(req.body);

  const userId= req.user?._id;
  const { workspace } = await createWorkspaceService(userId, body);


  return res.status(HTTPSTATUS.CREATED).json({
    message: "Workspace created successfully",
    workspace,
  })
});

export const getAllWorkspacesUserIsMemberController = asyncHandler(async(req:Request, res:Response) => {
  const userId = req.user?._id;

   const { workspace } = await getAllWorkspaceUserIsMemberService(userId);

   return res.status(HTTPSTATUS.OK).json({
    message: "User workspace fetched successfully",
    workspace,
   })
});

export const getWorkspaceByIdController = asyncHandler(async( req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const userId = req.user?._id;
  
  await getMemberRoleInWorkspace(userId, workspaceId);

  const { workspace } = await getWorkspaceByIdService(workspaceId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace fetched successfully", workspace
  })
});

export const getWorkspaceMembersController = asyncHandler(async(req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);

  const userId = req.user?._id;

  const {role} = await getMemberRoleInWorkspace(userId, workspaceId);

  roleGuard(role, [Permissions.VIEW_ONLY]);

  const { members , roles } = await getWorkspaceMembersService(workspaceId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace members retrieved successfully",
    members,
    roles,
  })
});

export const getWorkspaceAnalyticsController = asyncHandler(async(req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const userId = req.user?._id;
  
  const {role} = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Workspace Analytics retrieved Successfully",
    analytics
  })
});

export const changeWorkspaceMemberRoleController = asyncHandler(async(req: Request, res: Response)=>{
  const workspaceId = workspaceIdSchema.parse(req.params.id);
  const { memberId, roleId} = changeRolesSchema.parse(req.body);

  const userId = req.user?._id;
  
  const {role} = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

  const { member } = await changeMemberRoleService(
    workspaceId,
    memberId,
    roleId,
  );

  return res.status(HTTPSTATUS.OK).json({
    mesagge: "Member role changed successfully",
    member,
  })
});