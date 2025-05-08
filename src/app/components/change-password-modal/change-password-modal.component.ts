import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent {
  @Output() passwordChanged = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  changePasswordForm: FormGroup;
  error = '';
  success = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.success = '';

      const token = localStorage.getItem('token');
      if (!token) {
        this.error = 'Authentication token not found. Please log in again.';
        this.isLoading = false;
        return;
      }

      const headers = new HttpHeaders({
        'authorization': `Bearer ${token}`,
        'content-Type': 'application/json'
      });

      const payload = {
        CurrentPassword: this.changePasswordForm.get('currentPassword')?.value,
        NewPassword: this.changePasswordForm.get('newPassword')?.value
      };
    
      this.http.post('https://gamecontentmanagerbackend-1.onrender.com/api/auth/change-password', payload, {
        headers: headers
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.success = 'Password changed successfully!';
          this.changePasswordForm.reset();
          this.passwordChanged.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.status === 0) {
            this.error = 'Cannot connect to the server. Please make sure the backend server is running.';
          } else if (error.status === 401) {
            this.error = 'Current password is incorrect or session has expired.';
          } else if (error.status === 403) {
            this.error = 'You are not authorized to perform this action.';
          } else {
            this.error = 'Failed to change password. Please try again.';
          }
          console.error('Change password error:', error);
        }
      });
    }
  }

  onClose() {
    this.closeModal.emit();
  }
} 