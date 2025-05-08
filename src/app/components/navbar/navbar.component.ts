import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  hasAdminAccess = false;
  hasWriterAccess=false;
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.hasAdminAccess = this.authService.hasAdminAccess();
    this.hasWriterAccess = this.authService.hasWriteAccess();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
} 