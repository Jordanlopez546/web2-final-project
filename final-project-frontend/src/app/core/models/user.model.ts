export interface User {
  _id?: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Student extends User {
  age: number;
  enrolledCourses?: string[];
  role: UserRole.STUDENT;
}

export interface Admin extends User {
  role: UserRole.ADMIN;
}

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student'
}