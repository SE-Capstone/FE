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

export const defaultRoles = [
  RolesEnum.Admin,
  RolesEnum.HR,
  RolesEnum.Accountant,
  RolesEnum.Employee,
  RolesEnum.TeamLead,
];

export const GENDER_VALUES: Record<GenderEnum, string> = {
  [GenderEnum.male]: 'Nam',
  [GenderEnum.female]: 'Nữ',
  [GenderEnum.other]: 'Khác',
};

export const USER_STATUS_VALUES: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Active]: 'Hoạt động',
  [UserStatusEnum.Inactive]: 'Không hoạt động',
};

export enum OrderInput {
  DESC = 'desc',
  ASC = 'asc',
}

export function getGender(gender?: GenderEnum) {
  return gender ? GENDER_VALUES[gender] : '';
}
