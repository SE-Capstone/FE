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

export const USER_STATUS_OPTIONS = [
  {
    label: 'Active',
    value: UserStatusEnum.Active,
  },
  {
    label: 'Inactive',
    value: UserStatusEnum.Inactive,
  },
] as const;

export const PROJECT_STATUS_OPTIONS = [
  ProjectStatusEnum.NotStarted,
  ProjectStatusEnum.InProgress,
  ProjectStatusEnum.Completed,
  ProjectStatusEnum.Canceled,
];

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

export const ROLES_LABEL: Record<Exclude<RolesEnum, RolesEnum.Employee>, string> = {
  [RolesEnum.Admin]: `${RolesEnum.Admin}`,
  [RolesEnum.Accountant]: `${RolesEnum.Accountant}`,
  [RolesEnum.TeamLead]: `${RolesEnum.TeamLead}`,
  [RolesEnum.HR]: `${RolesEnum.HR}`,
};

export const ISSUE_PRIORITY_OPTIONS = [
  IssuePriorityEnum.Highest,
  IssuePriorityEnum.High,
  IssuePriorityEnum.Medium,
  IssuePriorityEnum.Low,
  IssuePriorityEnum.Lowest,
];

export const COLOR_OPTIONS = [
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
];

export const USER_STATUS_LABEL: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Active]: `Active`,
  [UserStatusEnum.Inactive]: `Inactive`,
};

export const GENDER_VALUES = (t: any): Record<GenderEnum, string> => ({
  [GenderEnum.male]: t('user.male'),
  [GenderEnum.female]: t('user.female'),
  [GenderEnum.other]: t('user.others'),
});

export const ISSUE_PRIORITY_VALUES = (t: any): Record<IssuePriorityEnum, string> => ({
  [IssuePriorityEnum.Lowest]: t('issue.lowest'),
  [IssuePriorityEnum.Low]: t('issue.low'),
  [IssuePriorityEnum.Medium]: t('issue.medium'),
  [IssuePriorityEnum.High]: t('issue.high'),
  [IssuePriorityEnum.Highest]: t('issue.highest'),
});

export const PERMISSIONS_VALUES = (t: any): Record<PermissionEnum, string> => ({
  // User
  [PermissionEnum.ADD_USER]: t('permissions.addUser'),
  [PermissionEnum.UPDATE_USER]: t('permissions.updateUser'),
  [PermissionEnum.TOGGLE_USER]: t('permissions.toggleUser'),
  [PermissionEnum.GET_LIST_USER]: t('permissions.getListUser'),
  [PermissionEnum.CHANGE_PASSWORD_USER]: t('permissions.changePassword'),
  [PermissionEnum.GET_DETAIL_USER]: t('permissions.getDetailUser'),

  // Project
  [PermissionEnum.ADD_PROJECT]: t('permissions.addProject'),
  [PermissionEnum.TOGGLE_VISIBLE_PROJECT]: t('permissions.toggleVisibleProject'),
  [PermissionEnum.DELETE_PROJECT]: t('permissions.deleteProject'),
  [PermissionEnum.UPDATE_PROJECT]: t('permissions.updateProject'),
  [PermissionEnum.READ_ALL_PROJECTS]: t('permissions.getListProject'),
  [PermissionEnum.SETTING_DETAIL_ALL_PROJECTS]: t('permissions.settingAllProject'),

  // Role
  [PermissionEnum.ADD_ROLE]: t('permissions.addRole'),
  [PermissionEnum.DELETE_ROLE]: t('permissions.deleteRole'),
  [PermissionEnum.READ_DETAIL_ROLE]: t('permissions.getRole'),
  [PermissionEnum.READ_LIST_ROLE]: t('permissions.readListRole'),
  [PermissionEnum.UPSERT_ROLE]: t('permissions.upsertRole'),

  // Project status
  [PermissionEnum.READ_DEFAULT_STATUS]: t('permissions.readDefaultStatus'),
  [PermissionEnum.UPDATE_DEFAULT_STATUS]: t('permissions.updateDefaultStatus'),
  [PermissionEnum.ADD_DEFAULT_STATUS]: t('permissions.addDefaultStatus'),
  [PermissionEnum.DELETE_DEFAULT_STATUS]: t('permissions.deleteDefaultStatus'),

  // Project label
  [PermissionEnum.READ_DEFAULT_LABEL]: t('permissions.readDefaultLabel'),
  [PermissionEnum.DELETE_DEFAULT_LABEL]: t('permissions.deleteDefaultLabel'),
  [PermissionEnum.ADD_DEFAULT_LABEL]: t('permissions.addDefaultLabel'),
  [PermissionEnum.UPDATE_DEFAULT_LABEL]: t('permissions.updateDefaultLabel'),

  // Skill
  [PermissionEnum.CREATE_SKILL]: t('permissions.createSkill'),
  [PermissionEnum.GET_SKILL]: t('permissions.getSkill'),
  [PermissionEnum.GET_SKILL_USER]: t('permissions.getSkillUser'),
  [PermissionEnum.UPDATE_SKILL]: t('permissions.updateSkill'),
  [PermissionEnum.UPSERT_SKILL_USER]: t('permissions.upsertSkillUser'),
  [PermissionEnum.DELETE_SKILL]: t('permissions.deleteSkill'),

  // Applicant
  [PermissionEnum.GET_APPLICANT]: t('permissions.getApplicant'),
  [PermissionEnum.ADD_APPLICANT]: t('permissions.addApplicant'),
  [PermissionEnum.UPDATE_APPLICANT]: t('permissions.updateApplicant'),
  [PermissionEnum.DELETE_APPLICANT]: t('permissions.deleteApplicant'),

  // Position
  [PermissionEnum.GET_POSITION]: t('permissions.getPosition'),
  [PermissionEnum.CREATE_POSITION]: t('permissions.createPosition'),
  [PermissionEnum.UPDATE_POSITION]: t('permissions.updatePosition'),
  [PermissionEnum.DELETE_POSITION]: t('permissions.deletePosition'),

  // Dashboard
  [PermissionEnum.VIEW_DASHBOARD]: t('permissions.viewDashboard'),
});

export const GROUP_PERMISSIONS_VALUES = (t: any): Record<GroupPermissionEnum, string> => ({
  [GroupPermissionEnum.USER]: t('groupPermissions.user'),
  [GroupPermissionEnum.ROLE]: t('groupPermissions.role'),
  [GroupPermissionEnum.PROJECT]: t('groupPermissions.project'),
  [GroupPermissionEnum.JOB]: t('groupPermissions.job'),
  [GroupPermissionEnum.STATUS]: t('groupPermissions.statusProject'),
  [GroupPermissionEnum.PHASE]: t('groupPermissions.phase'),
  [GroupPermissionEnum.LABEL]: t('groupPermissions.label'),
  [GroupPermissionEnum.SKILL]: t('groupPermissions.skill'),
  [GroupPermissionEnum.APPLICANT]: t('groupPermissions.applicant'),
  [GroupPermissionEnum.POSITION]: t('groupPermissions.position'),
  [GroupPermissionEnum.DASHBOARD]: t('groupPermissions.dashboard'),
});

export const PROJECT_STATUS_VALUES = (t: any): Record<ProjectStatusEnum, string> => ({
  [ProjectStatusEnum.NotStarted]: t('project.notStarted'),
  [ProjectStatusEnum.InProgress]: t('project.inProgress'),
  [ProjectStatusEnum.Completed]: t('project.completed'),
  [ProjectStatusEnum.Canceled]: t('project.canceled'),
});

export function getGender(t: any, gender?: GenderEnum) {
  return gender ? GENDER_VALUES(t)[gender] : '';
}

export function getPermission(t: any, permission?: PermissionEnum) {
  return permission ? PERMISSIONS_VALUES(t)[permission] : '';
}

export function getGroupPermission(t: any, permission?: GroupPermissionEnum) {
  return permission ? GROUP_PERMISSIONS_VALUES(t)[permission] : '';
}

export function getProjectStatus(status?: ProjectStatusEnum) {
  return status ? PROJECT_STATUS_VALUES[status] : '';
}

export const DEFAULT_MESSAGE = (t: any) => ({
  SUCCESS: t('messages.success'),
  SOMETHING_WRONG: t('messages.somethingWrong'),
  UPDATE_SUCCESS: t('messages.updateSuccess'),
  CREATE_SUCCESS: t('messages.createSuccess'),
  DELETE_SUCCESS: t('messages.deleteSuccess'),
});
