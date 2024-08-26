import { DashboardComponent } from './components/dashboard/dashboard.component';
import {ContractComponent } from './components/contracts/contract.component';
import { InsuranceComponent } from './components/insurance/insurance.component';
import { VehicleComponent } from './components/vehicles/vehicle.component';
import { MaintenanceRecordComponent } from './components/maintenanceRecords/maintenanceRecord.component';
import { PeriodicMaintenanceComponent } from './components/periodicMaintenance/periodicMaintenance.component';
import { NotificationComponent } from './components/notifications/notification.component';

import { LicenseComponent } from './components/licenses/license.component';
import { ReportsComponent } from './components/reports/reports.component';


import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { MaintenanceCardComponent } from './components/maintenance-card/maintenance-card.component';

const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  { path: '', component: LayoutComponent, children: [
  {path:'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'insurance', component:InsuranceComponent, canActivate:[AuthGuard]},
  {path:'license', component:LicenseComponent, canActivate:[AuthGuard]},
  {path:'contract', component:ContractComponent, canActivate:[AuthGuard]},
  {path:'vehicle', component:VehicleComponent, canActivate:[AuthGuard]},
  {path:'maintenance-record', component:MaintenanceRecordComponent, canActivate:[AuthGuard]},
  {path:'periodic-maintenance', component:PeriodicMaintenanceComponent, canActivate:[AuthGuard]},
  {path:'notification', component:NotificationComponent, canActivate:[AuthGuard]},
  {path:'reports', component:ReportsComponent, canActivate:[AuthGuard]},
  {path:'maintenance-card', component:MaintenanceCardComponent, canActivate:[AuthGuard]},

  ]},
/*   { path: 'MaintenanceCard', loadChildren: () => import('./maintenance-card/maintenance-card.module').then(m => m.MaintenanceCardModule) }, */
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
