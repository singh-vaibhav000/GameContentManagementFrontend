import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  roles: string[];
  mustChangePassword: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface TokenPayload {
  exp: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gamecontentmanagerbackend-1.onrender.com/api/auth';
  private tokenExpiryCheckInterval: any;
  private readonly EXPIRY_WARNING_TIME = 60000; // 1 minute in milliseconds
  public tokenExpiryWarning = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.startTokenExpiryCheck();
  }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  private startTokenExpiryCheck(): void {
    // Check every 30 seconds
    this.tokenExpiryCheckInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const timeUntilExpiry = this.getTimeUntilExpiry(token);
        if (timeUntilExpiry > 0 && timeUntilExpiry <= this.EXPIRY_WARNING_TIME) {
          this.tokenExpiryWarning.next();
        } else if (timeUntilExpiry <= 0) {
          this.handleExpiredToken();
        }
      }
    }, 30000);
  }

  private getTimeUntilExpiry(token: string): number {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
      const expiryTime = tokenPayload.exp * 1000; // Convert to milliseconds
      return expiryTime - Date.now();
    } catch {
      return 0;
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/refresh-token`,
      {}, 
      { headers: this.getHeaders() } 
    );
  }
  

  hasAdminAccess(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const roles = tokenPayload[roleClaim];
      const roleList = Array.isArray(roles) ? roles : [roles];
      return roleList.includes('Admin');
    } catch {
      return false;
    }
  }

  hasWriteAccess(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const roles = tokenPayload[roleClaim];
      const roleList = Array.isArray(roles) ? roles : [roles];
      return roleList.includes('Writer');
    } catch {
      return false;
    }
  }
  hasReaderAccess(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const roles = tokenPayload[roleClaim];
      const roleList = Array.isArray(roles) ? roles : [roles];
      return roleList.includes('Reader');
    } catch {
      return false;
    }
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleExpiredToken(): void {
    this.logout();
    window.location.reload();
  }

  logout(): void {
    localStorage.removeItem('token');
    if (this.tokenExpiryCheckInterval) {
      clearInterval(this.tokenExpiryCheckInterval);
    }
    window.location.reload();
  }
} 