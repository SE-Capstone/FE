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
  IS_PROJECT_LEAD = 'IS_PROJECT_LEAD',
  ADD_MEMBER_TO_PROJECT = 'ADD_MEMBER_TO_PROJECT',
  TOGGLE_VISIBLE_PROJECT = 'TOGGLE_VISIBLE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  GET_LIST_PROJECT = 'GET_LIST_PROJECT',

  // Role
  ADD_ROLE = 'ADD_ROLE',
  READ_DETAIL_ROLE = 'READ_DETAIL_ROLE',
  READ_LIST_ROLE = 'READ_LIST_ROLE',
  UPSERT_ROLE = 'UPSERT_ROLE',

  // Project status
  UPDATE_DEFAULT_STATUS = 'UPDATE_DEFAULT_STATUS',
  ADD_DEFAULT_STATUS = 'ADD_DEFAULT_STATUS',
  DELETE_STATUS = 'DELETE_STATUS',
  DELETE_DEFAULT_STATUS = 'DELETE_DEFAULT_STATUS',
  UPDATE_STATUS = 'UPDATE_STATUS',
  ADD_STATUS = 'ADD_STATUS',

  // Project label
  UPDATE_LABEL = 'UPDATE_LABEL',
  DELETE_DEFAULT_LABEL = 'DELETE_DEFAULT_LABEL',
  DELETE_LABEL = 'DELETE_LABEL',
  ADD_DEFAULT_LABEL = 'ADD_DEFAULT_LABEL',
  ADD_LABEL = 'ADD_LABEL',
  UPDATE_DEFAULT_LABEL = 'UPDATE_DEFAULT_LABEL',

  // Phase
  ADD_PHASE = 'ADD_PHASE',
  UPDATE_PHASE = 'UPDATE_PHASE',
  DELETE_PHASE = 'DELETE_PHASE',

  // Issue
  DELETE_ISSUE = 'DELETE_ISSUE',
  ADD_ISSUE = 'ADD_ISSUE',
  UPDATE_ISSUE = 'UPDATE_ISSUE',
}

export enum GroupPermissionEnum {
  USER = 'USER',
  ROLE = 'ROLE',
  PROJECT = 'PROJECT',
  JOB = 'JOB',
  ISSUE = 'ISSUE',
  STATUS = 'STATUS',
  PHASE = 'PHASE',
  LABEL = 'LABEL',
}
