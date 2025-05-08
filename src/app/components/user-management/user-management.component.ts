import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  isCreating = false;
  isEditing = false;
  userForm: FormGroup;
  roles = ['Admin', 'Writer', 'Reader'];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      roles: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      users => this.users = users,
      error => console.error('Error loading users:', error)
    );
  }

  onRoleChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const roles = this.userForm.get('roles')?.value as string[];

    if (checkbox.checked) {
      this.userForm.patchValue({ roles: [...roles, checkbox.value] });
    } else {
      this.userForm.patchValue({ roles: roles.filter(r => r !== checkbox.value) });
    }
  }

  createUser(): void {
    if (this.userForm.valid) {
      const request: CreateUserRequest = {
        email: this.userForm.get('email')?.value,
        password: this.userForm.get('password')?.value,
        roles: this.userForm.get('roles')?.value
      };

      this.userService.createUser(request).subscribe(
        () => {
          this.loadUsers();
          this.isCreating = false;
          this.userForm.reset({
            email: '',
            password: '',
            roles: []
          });
        },
        error => console.error('Error creating user:', error)
      );
    }
  }

  updateUser(): void {
    if (this.userForm.valid && this.selectedUser) {
      const request: UpdateUserRequest = {
        email: this.userForm.get('email')?.value,
        roles: this.userForm.get('roles')?.value
      };

      const password = this.userForm.get('password')?.value;
      if (password) {
        (request as any).password = password;
      }

      this.userService.updateUser(this.selectedUser.id, request).subscribe(
        () => {
          this.loadUsers();
          this.isEditing = false;
          this.selectedUser = null;
          this.userForm.reset({
            email: '',
            password: '',
            roles: []
          });
        },
        error => console.error('Error updating user:', error)
      );
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(
        () => this.loadUsers(),
        error => console.error('Error deleting user:', error)
      );
    }
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.isEditing = true;
    this.userForm.patchValue({
      email: user.email,
      password: '', // allow new password input
      roles: user.roles
    });
  }

  cancel(): void {
    this.isCreating = false;
    this.isEditing = false;
    this.selectedUser = null;
    this.userForm.reset({
      email: '',
      password: '',
      roles: []
    });
  }
}
