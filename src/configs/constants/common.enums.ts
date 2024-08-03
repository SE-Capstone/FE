export enum GenderEnum {
  male = 'male',
  female = 'female',
  other = 'other',
}

export enum RolesEnum {
  User = 'USER',
  Admin = 'ADMIN',
  Agency = 'AGENCY',
  Staff = 'STAFF',
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
