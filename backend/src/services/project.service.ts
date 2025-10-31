import MemberModel from "../models/member.model";
import ProjectModel from "../models/project.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException, NotFoundException } from "../utils/appError";

export const createProjectByWorkspaceIdService = async (
  userId: string,
  workspaceId: string,
  body: {
      emoji?: string,
      name: string,
      description?: string,
  }
) => {
  const { emoji, name, description } = body;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found")
  }

  const isAlreadyMember = await MemberModel.findOne({
    userId: user._id,
    workspaceId: workspace._id
  }).exec();

  if (!isAlreadyMember) {
    throw new BadRequestException("You are not member of this workspace")
  }

  const project = new ProjectModel({
    ...(emoji && {emoji: emoji}),
    name: name,
    description: description,
    workspace: workspaceId,
    createdBy: userId,
  });

  await project.save();
  
  return { 
    project
  }
}

export const getAllProjectInWorkspaceService = async(
  userId: string,
  workspaceId: string,
  pageNumber: number,
  pageSize: number,
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found")
  }

  const isAlreadyMember = await MemberModel.findOne({
    userId: user._id,
    workspaceId: workspace._id
  }).exec();

  if (!isAlreadyMember) {
    throw new BadRequestException("You are not member of this workspace")
  } 

  // Find all project dengan pagination
  const totalCount = await ProjectModel.countDocuments({
    workspace: workspaceId
  });

  const skip = (pageNumber - 1) * pageSize;

  const Projects = await ProjectModel.find({ workspace: workspaceId })
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy", "_id name profilePicture -password")
    .sort({ createdAt: -1}).exec();

  const totalPage = Math.ceil(totalCount / pageSize);

  return {
    Projects,
    totalCount,
    totalPage,
    skip,
  };
}

export const updateProjectByIdService = async (
    projectId: string,
    workspaceId: string,
    emoji: string | undefined,
    name: string,
    description: string | undefined,
    userId: string,
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found")
  }

  const isAlreadyMember = await MemberModel.findOne({
    userId: userId,
    workspaceId: workspaceId
  }).exec();

  if (!isAlreadyMember) {
    throw new BadRequestException("You are not member of this workspace")
  } 

  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
    createdBy:  userId,
  });

  if (!project) {
    throw new NotFoundException("Project not found");
  }
    project.name = name || project.name;
    project.description = description || project.description;
    project.emoji = emoji || project.emoji;

    await project.save()

    return {
      project
    }
}

export const getProjectByIdAndWorkspaceService = async (
    projectId: string,
    workspaceId: string,
) => {

  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select("_id emoji name description");

  if (!project) {
    throw new NotFoundException("Project not found");
  }
  
  return {
    project
  }
}