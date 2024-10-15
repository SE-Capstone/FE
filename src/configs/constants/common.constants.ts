import {
  GenderEnum,
  RolesEnum,
  UserStatusEnum,
  PermissionEnum,
  GroupPermissionEnum,
} from './common.enums';

import { IssuePriorityEnum } from '@/modules/issues/list-issue/types';
import { ProjectStatusEnum } from '@/modules/projects/list-project/types';

export const YESTERDAY = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);

export const MAX_SIZE_IMAGE = 5 * 1024 * 1024;

export const MAX_SIZE_VIDEO = 10 * 1024 * 1024;

export const FILE_TYPES_IMAGES = ['jpeg', 'png', 'jpg', 'heic', 'heif'];

export const REGEX_FILE_TYPE_IMAGES = /([a-zA-Z0-9\s_\\.\-\(\):])+(.jpeg|.png|.jpg|.heic|.heif)$/i;

export const REGEX_FILE_TYPE_VIDEOS = /\.(mp4|mov|avi|wmv)$/i;

export const REGEX_FILE_TYPE_PDFS = /\.pdf$/i;

export const REGEX_FILE_TYPE_WORD = /\.(doc|docx)$/i;

export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const REGEX_FILE_TYPE_VIDEO = /([a-zA-Z0-9\s_\\.\-\(\):])+(.mp4)$/i;

export const REGEX_URL =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export const FILES_TYPE_CSV_EXCEL = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.ms-excel',
];

export const DEFAULT_PAGINATION = {
  pageIndex: 1,
  perSize: 10,
};

export const GENDER_OPTIONS = [
  {
    label: 'Male',
    value: GenderEnum.male,
  },
  {
    label: 'Female',
    value: GenderEnum.female,
  },
  {
    label: 'Others',
    value: GenderEnum.other,
  },
] as const;

export const PROJECT_STATUS_OPTIONS = [
  {
    label: 'Active',
    value: ProjectStatusEnum.Active,
  },
  {
    label: 'Pending',
    value: ProjectStatusEnum.Pending,
  },
  {
    label: 'Inactive',
    value: ProjectStatusEnum.Inactive,
  },
] as const;

export const PROJECT_VISIBILITY_OPTIONS = [
  {
    label: 'Visible',
    value: 'true',
  },
  {
    label: 'Invisible',
    value: 'false',
  },
] as const;

export const ROLES_ACCESS: RolesEnum[] = [
  RolesEnum.Admin,
  RolesEnum.Accountant,
  RolesEnum.TeamLead,
  RolesEnum.HR,
  RolesEnum.Employee,
];

export const ROLES_LABEL: Record<Exclude<RolesEnum, RolesEnum.Employee>, string> = {
  [RolesEnum.Admin]: `${RolesEnum.Admin}`,
  [RolesEnum.Accountant]: `${RolesEnum.Accountant}`,
  [RolesEnum.TeamLead]: `${RolesEnum.TeamLead}`,
  [RolesEnum.HR]: `${RolesEnum.HR}`,
};

export const ISSUE_PRIORITY_OPTIONS = [
  {
    label: 'Lowest',
    value: IssuePriorityEnum.Lowest,
  },
  {
    label: 'Low',
    value: IssuePriorityEnum.Low,
  },
  {
    label: 'Medium',
    value: IssuePriorityEnum.Medium,
  },
  {
    label: 'High',
    value: IssuePriorityEnum.High,
  },
  {
    label: 'Highest',
    value: IssuePriorityEnum.Highest,
  },
];

export const USER_STATUS_OPTIONS = [
  {
    label: 'Active',
    value: UserStatusEnum.Active,
  },
  {
    label: 'Inactive',
    value: UserStatusEnum.Inactive,
  },
];

export const COLOR_OPTIONS = [
  'whiteAlpha',
  'blackAlpha',
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink',
  'linkedin',
  'facebook',
  'messenger',
  'whatsapp',
  'twitter',
  'telegram',
];

export const USER_STATUS_LABEL: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Active]: `Active`,
  [UserStatusEnum.Inactive]: `Inactive`,
};

export const GENDER_VALUES: Record<GenderEnum, string> = {
  [GenderEnum.male]: 'Male',
  [GenderEnum.female]: 'Female',
  [GenderEnum.other]: 'Others',
};

export const ISSUE_PRIORITY_VALUES: Record<IssuePriorityEnum, string> = {
  [IssuePriorityEnum.Lowest]: 'Lowest',
  [IssuePriorityEnum.Low]: 'Low',
  [IssuePriorityEnum.Medium]: 'Medium',
  [IssuePriorityEnum.High]: 'High',
  [IssuePriorityEnum.Highest]: 'Highest',
};

export const PERMISSIONS_VALUES: Record<PermissionEnum, string> = {
  [PermissionEnum.ADD_USER]: 'Create user',
  [PermissionEnum.GET_LIST_USER]: 'Get list user',
  [PermissionEnum.ADD_PROJECT]: 'Create project',
  [PermissionEnum.IS_PROJECT_LEAD]: 'Assign as project lead',
  [PermissionEnum.GET_LIST_PROJECT]: 'Get list project',
  [PermissionEnum.GET_DETAIL_PROJECT]: 'Get project detail',
  [PermissionEnum.DELETE_PROJECT]: 'Update project status',
  [PermissionEnum.UPDATE_PROJECT]: 'Update project information',
  [PermissionEnum.TOGGLE_VISIBLE_PROJECT]: 'Update project visible state',
  [PermissionEnum.GET_ALL_PROJECT]: 'View list project',
  [PermissionEnum.ADD_MEMBER_TO_PROJECT]: 'Add member to project',
  [PermissionEnum.ADD_ROLE]: 'Create role',
  [PermissionEnum.GET_ROLE]: 'Get role',
  [PermissionEnum.ADD_ROLE_FOR_USER]: 'Add role for user',
  [PermissionEnum.READ_LIST_ROLE]: 'Read list role',
  [PermissionEnum.CHANGE_PASSWORD]: 'Change user password',
  [PermissionEnum.GET_ROLE_DETAIL]: 'Get role detail',
};

export const GROUP_PERMISSIONS_VALUES: Record<GroupPermissionEnum, string> = {
  [GroupPermissionEnum.USER]: 'User',
  [GroupPermissionEnum.ROLE]: 'Role',
  [GroupPermissionEnum.PROJECT]: 'Project',
  [GroupPermissionEnum.JOB]: 'Job',
  [GroupPermissionEnum.TASK]: 'Task',
};

export const PROJECT_STATUS_VALUES: Record<ProjectStatusEnum, string> = {
  [ProjectStatusEnum.Pending]: 'Pending',
  [ProjectStatusEnum.Active]: 'Active',
  [ProjectStatusEnum.Inactive]: 'Inactive',
};

export function getGender(gender?: GenderEnum) {
  return gender ? GENDER_VALUES[gender] : '';
}

export function getPermission(permission?: PermissionEnum) {
  return permission ? PERMISSIONS_VALUES[permission] : '';
}

export function getGroupPermission(permission?: GroupPermissionEnum) {
  return permission ? GROUP_PERMISSIONS_VALUES[permission] : '';
}

export function getProjectStatus(status?: ProjectStatusEnum) {
  return status ? PROJECT_STATUS_VALUES[status] : '';
}

export const DEFAULT_MESSAGE = {
  SUCCESS: 'Success',
  SOMETHING_WRONG: 'Something went wrong, please try again',
  UPDATE_SUCCESS: 'Update successfully',
  CREATE_SUCCESS: 'Create successfully',
  DELETE_SUCCESS: 'Delete successfully',
};
