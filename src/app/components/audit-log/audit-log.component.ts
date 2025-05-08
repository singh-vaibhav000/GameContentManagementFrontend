import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../../services/audit-log.service';
import { AuditLog, AuditLogFilter } from '../../models/audit-log';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  isLoading = false;
  error = '';
  filter: AuditLogFilter = {
    startDate: undefined,
    endDate: undefined,
    entityType: '',
    action: ''
  };
  hasAdminAccess = false;

  constructor(
    private auditLogService: AuditLogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.hasAdminAccess = this.authService.hasAdminAccess();
    if (this.hasAdminAccess) {
      this.loadAuditLogs();
    } else {
      this.error = 'You do not have permission to view audit logs';
    }
  }

  loadAuditLogs(): void {
    this.isLoading = true;
    this.error = '';

    this.auditLogService.getAuditLogs(this.filter).subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load audit logs';
        this.isLoading = false;
        console.error('Error loading audit logs:', error);
      }
    });
  }

  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filter.startDate = input.value ? new Date(input.value) : undefined;
  }

  onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filter.endDate = input.value ? new Date(input.value) : undefined;
  }

  onEntityTypeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filter.entityType = input.value;
  }

  onActionChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filter.action = input.value;
  }

  applyFilter(): void {
    this.loadAuditLogs();
  }

  clearFilter(): void {
    this.filter = {
      startDate: undefined,
      endDate: undefined,
      entityType: '',
      action: ''
    };
    this.loadAuditLogs();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  formatJson(value: string): string {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  formatDateForInput(date: Date | undefined): string {
    return date ? date.toISOString().slice(0, 16) : '';
  }
} 