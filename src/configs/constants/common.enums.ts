export enum CustomHttpStatusCode {
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
  GET_LIST_USER = 'GET_LIST_USER',
  CHANGE_PASSWORD_USER = 'CHANGE_PASSWORD_USER',

  // Project
  ADD_PROJECT = 'ADD_PROJECT',
  ADD_MEMBER_TO_PROJECT = 'ADD_MEMBER_TO_PROJECT',
  TOGGLE_VISIBLE_PROJECT = 'TOGGLE_VISIBLE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  SETTING_ALL_PROJECT = 'SETTING_ALL_PROJECT',

  // Role
  ADD_ROLE = 'ADD_ROLE',
  READ_DETAIL_ROLE = 'READ_DETAIL_ROLE',
  READ_LIST_ROLE = 'READ_LIST_ROLE',
  UPSERT_ROLE = 'UPSERT_ROLE',

  // Project status
  UPDATE_DEFAULT_STATUS = 'UPDATE_DEFAULT_STATUS',
  ADD_DEFAULT_STATUS = 'ADD_DEFAULT_STATUS',
  DELETE_DEFAULT_STATUS = 'DELETE_DEFAULT_STATUS',

  // Project label
  DELETE_DEFAULT_LABEL = 'DELETE_DEFAULT_LABEL',
  ADD_DEFAULT_LABEL = 'ADD_DEFAULT_LABEL',
  UPDATE_DEFAULT_LABEL = 'UPDATE_DEFAULT_LABEL',
}

export enum ProjectPermissionEnum {
  IsProjectConfigurator = 'IsProjectConfigurator',
  IsIssueConfigurator = 'IsIssueConfigurator',
  IsPermissionConfigurator = 'IsPermissionConfigurator',
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
}
