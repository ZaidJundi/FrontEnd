import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InsuranceComponent } from './components/insurance/insurance.component';
import { ContractComponent } from './components/contracts/contract.component';
import { VehicleComponent } from './components/vehicles/vehicle.component';
import { MaintenanceRecordComponent } from './components/maintenanceRecords/maintenanceRecord.component';
import { PeriodicMaintenanceComponent } from './components/periodicMaintenance/periodicMaintenance.component';
import { NotificationComponent } from './components/notifications/notification.component';
import { MatDialogModule } from '@angular/material/dialog';

import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { TokenInterceptor } from './interceptors/token.interceptor';
import { MatSortModule } from '@angular/material/sort';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LicenseComponent } from './components/licenses/license.component';

import { LayoutComponent } from './shared/layout/layout.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
import { MaintenanceCardComponent } from './components/maintenance-card/maintenance-card.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LayoutComponent,
    InsuranceComponent,
    ContractComponent,
    VehicleComponent,
    MaintenanceRecordComponent,
    PeriodicMaintenanceComponent,
    LicenseComponent,
    NotificationComponent,
    ReportsComponent,
    ReportDialogComponent,
    MaintenanceCardComponent,
  ],
  imports: [
    MatSelectModule,
    MatDialogModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SweetAlert2Module,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatMenuModule,
    MatProgressBarModule,
    CommonModule,
    MatSortModule,
    MatBadgeModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
