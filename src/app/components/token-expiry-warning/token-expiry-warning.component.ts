import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-token-expiry-warning',
  template: `
    <div *ngIf="showWarning" class="modal-backdrop">
      <div class="modal-content">
        <h2>Session Expiring Soon</h2>
        <p>Your session will expire in 1 minute. Would you like to stay logged in?</p>
        <div class="modal-actions">
          <button (click)="onStayLoggedIn()">Yes, Stay Logged In</button>
          <button (click)="onLogout()">No, Logout</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      max-width: 400px;
      width: 90%;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:first-child {
      background-color: #4CAF50;
      color: white;
    }

    button:last-child {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class TokenExpiryWarningComponent implements OnInit, OnDestroy {
  showWarning = false;
  private subscription: Subscription;

  constructor(private authService: AuthService) {
    this.subscription = this.authService.tokenExpiryWarning.subscribe(() => {
      this.showWarning = true;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onStayLoggedIn(): void {
    this.authService.refreshToken().subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.showWarning = false;
      },
      error: () => {
        this.onLogout();
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.showWarning = false;
  }
} 