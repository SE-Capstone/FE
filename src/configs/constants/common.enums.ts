export enum CustomHttpStatusCode {
  INACTIVE_USER = 789,
  ROLE_CHANGED = 888,
  TOKEN_EXPIRED = 999,
}

export enum GenderEnum {
  male = 1,
  female = 2,
  other = 3,
}

export enum UserStatusEnum {
  Active = 1,
  Inactive = 2,
}

export enum RolesEnum {
  Admin = 'ADMIN',
  HR = 'HR',
  Accountant = 'ACCOUNTANT',
  Employee = 'EMPLOYEE',
  TeamLead = 'TEAM_LEAD',
}

export enum OrderInput {
  DESC = 'desc',
  ASC = 'asc',
}

export enum PermissionEnum {
  // User
  ADD_USER = 'ADD_USER',
  UPDATE_USER = 'UPDATE_USER',
  TOGGLE_USER = 'TOGGLE_USER',
  GET_LIST_USER = 'GET_LIST_USER',
  CHANGE_PASSWORD_USER = 'CHANGE_PASSWORD_USER',
  GET_DETAIL_USER = 'GET_DETAIL_USER',

  // Project
  ADD_PROJECT = 'ADD_PROJECT',
  TOGGLE_VISIBLE_PROJECT = 'TOGGLE_VISIBLE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  READ_ALL_PROJECTS = 'READ_ALL_PROJECTS',
  SETTING_DETAIL_ALL_PROJECTS = 'SETTING_DETAIL_ALL_PROJECTS',

  // Role
  ADD_ROLE = 'ADD_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',
  READ_DETAIL_ROLE = 'READ_DETAIL_ROLE',
  READ_LIST_ROLE = 'READ_LIST_ROLE',
  UPSERT_ROLE = 'UPSERT_ROLE',

  // Project status
  READ_DEFAULT_STATUS = 'READ_DEFAULT_STATUS',
  UPDATE_DEFAULT_STATUS = 'UPDATE_DEFAULT_STATUS',
  ADD_DEFAULT_STATUS = 'ADD_DEFAULT_STATUS',
  DELETE_DEFAULT_STATUS = 'DELETE_DEFAULT_STATUS',

  // Project label
  READ_DEFAULT_LABEL = 'READ_DEFAULT_LABEL',
  DELETE_DEFAULT_LABEL = 'DELETE_DEFAULT_LABEL',
  ADD_DEFAULT_LABEL = 'ADD_DEFAULT_LABEL',
  UPDATE_DEFAULT_LABEL = 'UPDATE_DEFAULT_LABEL',

  // Skill
  CREATE_SKILL = 'CREATE_SKILL',
  UPDATE_SKILL = 'UPDATE_SKILL',
  DELETE_SKILL = 'DELETE_SKILL',
  GET_SKILL = 'GET_SKILL',
  GET_SKILL_USER = 'GET_SKILL_USER',
  UPSERT_SKILL_USER = 'SKILL_USER',

  // Applicant
  GET_APPLICANT = 'GET_APPLICANT',
  ADD_APPLICANT = 'ADD_APPLICANT',
  UPDATE_APPLICANT = 'UPDATE_APPLICANT',
  DELETE_APPLICANT = 'DELETE_APPLICANT',

  // Position
  GET_POSITION = 'GET_POSITION',
  CREATE_POSITION = 'CREATE_POSITION',
  UPDATE_POSITION = 'UPDATE_POSITION',
  DELETE_POSITION = 'DELETE_POSITION',

  // Dashboard
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
}

export enum ProjectPermissionEnum {
  IsProjectConfigurator = 'IsProjectConfigurator',
  IsIssueConfigurator = 'IsIssueConfigurator',
  IsMemberConfigurator = 'IsMemberConfigurator',
  IsCommentConfigurator = 'IsCommentConfigurator',
}

export enum GroupPermissionEnum {
  USER = 'USER',
  ROLE = 'ROLE',
  PROJECT = 'PROJECT',
  JOB = 'JOB',
  STATUS = 'STATUS',
  PHASE = 'PHASE',
  LABEL = 'LABEL',
  SKILL = 'SKILL',
  APPLICANT = 'APPLICANT',
  POSITION = 'POSITION',
  DASHBOARD = 'DASHBOARD',
}
