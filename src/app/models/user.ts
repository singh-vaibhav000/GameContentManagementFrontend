export interface User {
  id: string;
  email: string;
  roles: string[];
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserRequest {
  email?: string;
  roles?: string[];
  mustChangePassword?: boolean;
}

export interface AssignRolesRequest {
  roles: string[];
} 