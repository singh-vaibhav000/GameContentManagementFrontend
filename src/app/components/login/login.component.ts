import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error = '';
  showChangePasswordModal = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/characters']);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.email?.value, this.password?.value).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.isLoading = false;
        if (!response.user.mustChangePassword) {
          this.showChangePasswordModal = true;
        } else {
          this.router.navigate(['/characters']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  onPasswordChanged(): void {
    this.showChangePasswordModal = false;
    this.router.navigate(['/characters']);
  }

  onCloseModal(): void {
    this.showChangePasswordModal = false;
    this.router.navigate(['/characters']);
  }
} 