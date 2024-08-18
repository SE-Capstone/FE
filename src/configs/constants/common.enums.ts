export enum GenderEnum {
  male = 'male',
  female = 'female',
  other = 'other',
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum RolesEnum {
  Admin = 'ADMIN',
  HR = 'HR',
  Accountant = 'ACCOUNTANT',
  Employee = 'EMPLOYEE',
  TeamLead = 'TEAM_LEAD',
}

export const GENDER_VALUES: Record<keyof typeof GenderEnum, string> = {
  female: 'Nữ',
  male: 'Nam',
  other: 'Khác',
};

export enum StatusEnum {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export enum OrderInput {
  DESC = 'desc',
  ASC = 'asc',
}
