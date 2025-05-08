import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-token-expiry-warning',
  templateUrl: './token-expiry-warning.component.html',
  styleUrls: ['./token-expiry-warning.component.css']
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