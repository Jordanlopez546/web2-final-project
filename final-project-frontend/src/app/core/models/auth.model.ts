import { Admin, Student } from "./user.model";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterStudentRequest {
  fullName: string;
  email: string;
  password: string;
  age: number;
}

export interface RegisterAdminRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    student?: Student;
    admin?: Admin;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}