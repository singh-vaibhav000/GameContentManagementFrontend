import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog, AuditLogFilter } from '../models/audit-log';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = 'https://gamecontentmanagerbackend-1.onrender.com/api/AuditLog';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAuditLogs(filter?: AuditLogFilter): Observable<AuditLog[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.startDate) {
        params = params.set('startDate', filter.startDate.toISOString());
      }
      if (filter.endDate) {
        params = params.set('endDate', filter.endDate.toISOString());
      }
      if (filter.userId) {
        params = params.set('userId', filter.userId);
      }
      if (filter.entityType) {
        params = params.set('entityType', filter.entityType);
      }
      if (filter.action) {
        params = params.set('action', filter.action);
      }
    }

    return this.http.get<AuditLog[]>(this.apiUrl, {
      headers: this.getHeaders(),
      params
    });
  }

  getAuditLogById(id: string): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
} 