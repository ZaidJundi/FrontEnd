import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://localhost:7038/api/';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any>(`${this.baseUrl}User`);
  }

  getContracts() {
    return this.http.get<any>(`${this.baseUrl}Company`);
  }

  getVehicles() {
    return this.http.get<any>(`${this.baseUrl}Company/vehicles`);
  }

  getLicenses() {
    return this.http.get<any>(`${this.baseUrl}Company/licenses`);
  }

  getInsurance() {
    return this.http.get<any>(`${this.baseUrl}Company/insurance`);
  }
  getMaintenaneCard() {
    return this.http.get<any>(`${this.baseUrl}Company/maintenance-card`);
  }
  getMaintenanceRecords() {
    return this.http.get<any>(`${this.baseUrl}Company/maintenance-record`);
  }

  getPeriodicMaintenance() {
    return this.http.get<any>(`${this.baseUrl}Company/periodic-maintenance`);
  }

  getNotifications() {
    return this.http.get<any>(`${this.baseUrl}Company/notifications`);
  }
  getReports() {
    return this.http.get<any>(`${this.baseUrl}Company/report-incident`);
  }
  reportIncident(vehicleId: string, problemName: string): Observable<any> {
    const body = {
      VehicleId: vehicleId,
      ProblemName: problemName
    };
    return this.http.post<any>(`${this.baseUrl}Company/report-incident`, body);
  }
  getPeriodicMaintenanceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Company/periodic-maintenance/${id}`);
  }

  updatePeriodicMaintenance(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}Company/periodic-maintenances/${id}`, data);
  }
}
