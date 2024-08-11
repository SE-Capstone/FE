import { GenderEnum, RolesEnum } from './common.enums';

export const YESTERDAY = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);

export const MAX_SIZE_IMAGE = 5 * 1024 * 1024;

export const MAX_SIZE_VIDEO = 10 * 1024 * 1024;

export const FILE_TYPES_IMAGES = ['jpeg', 'png', 'jpg', 'heic', 'heif'];

export const REGEX_FILE_TYPE_IMAGES = /([a-zA-Z0-9\s_\\.\-\(\):])+(.jpeg|.png|.jpg|.heic|.heif)$/i;

export const REGEX_FILE_TYPE_VIDEO = /([a-zA-Z0-9\s_\\.\-\(\):])+(.mp4)$/i;

export const REGEX_URL =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export const FILES_TYPE_CSV_EXCEL = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.ms-excel',
];

export const DEFAULT_PAGINATION = {
  page: 1,
  perPage: 10,
  createAt: 'desc',
};

export const ROLE_OPTIONS: Array<{ label: string; value: `${RolesEnum}` }> = [
  {
    label: 'Người dùng',
    value: RolesEnum.User,
  },
  {
    label: 'Agency - Chủ cửa hàng',
    value: RolesEnum.Agency,
  },
  {
    label: 'Nhân viên hệ thống',
    value: RolesEnum.Staff,
  },
];

export const GENDER_OPTIONS = [
  {
    label: 'Nam',
    value: GenderEnum.male,
  },
  {
    label: 'Nữ',
    value: GenderEnum.female,
  },
  {
    label: 'Khác',
    value: GenderEnum.other,
  },
] as const;

export const ROLES_ACCESS: RolesEnum[] = [RolesEnum.Admin, RolesEnum.Staff, RolesEnum.Agency];

export const ROLES_LABEL: Record<Exclude<RolesEnum, RolesEnum.User>, string> = {
  [RolesEnum.Admin]: `Quản trị viên - ${RolesEnum.Admin}`,
  [RolesEnum.Staff]: `Nhân viên hệ thống BGP - ${RolesEnum.Staff}`,
  [RolesEnum.Agency]: `Chủ cửa hàng - ${RolesEnum.Agency}`,
};

export const DEFAULT_MESSAGE = {
  SUCCESS: 'Thành công',
  SOMETHING_WRONG: 'Có lỗi xảy ra, vui lòng thử lại',
};
