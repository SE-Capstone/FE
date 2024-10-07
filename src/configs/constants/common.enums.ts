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
  ADD_USER = 'ADD_USER',
  GET_LIST_USER = 'GET_LIST_USER',
  ADD_PROJECT = 'ADD_PROJECT',
  IS_PROJECT_LEAD = 'IS_PROJECT_LEAD',
  GET_LIST_PROJECT = 'GET_LIST_PROJECT',
  GET_DETAIL_PROJECT = 'GET_DETAIL_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  TOGGLE_VISIBLE_PROJECT = 'TOGGLE_VISIBLE_PROJECT',
  GET_ALL_PROJECT = 'GET_ALL_PROJECT',
  ADD_MEMBER_TO_PROJECT = 'ADD_MEMBER_TO_PROJECT',
  ADD_ROLE = 'ADD_ROLE',
  GET_ROLE = 'GET_ROLE',
  ADD_ROLE_FOR_USER = 'ADD_ROLE_FOR_USER',
  READ_LIST_ROLE = 'READ_LIST_ROLE',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  GET_ROLE_DETAIL = 'GET_ROLE_DETAIL',
}

export enum GroupPermissionEnum {
  USER = 'USER',
  ROLE = 'ROLE',
  PROJECT = 'PROJECT',
  JOB = 'JOB',
  TASK = 'TASK',
}
