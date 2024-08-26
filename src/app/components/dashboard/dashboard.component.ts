import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from './../../services/api.service';
import { AuthService } from './../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import * as XLSX from 'xlsx';
import { SpinnerService } from './../../services/spinner.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  public users: any = [];
  public role!: string;
  public contracts = new MatTableDataSource<any>([]);
  public vehicles: any = [];
  public licenses: any = [];
  public insurance: any = [];
  public maintenanceContracts: any = [];
  public maintenanceRecords: any = [];
  public periodicMaintenance: any = [];
  showSpinner: boolean = false;
  userName: string = "";
  public fullName: string = "";
  public displayedColumns: string[] = ['index', 'contractId', 'startDateOfFinancing', 'endDateOfFinancing', 'contractStatus'];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    public spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.spinnerService.visibility.subscribe(show => {
      this.showSpinner = show;
      this.cdr.detectChanges();
    });

    this.api.getUsers().subscribe(res => {
      this.users = res;
    });

    this.api.getContracts().subscribe(res => {
      this.contracts.data = res;
      console.log(res);
    });

    this.api.getVehicles().subscribe(res => {
      this.vehicles = res;
    });

    this.api.getLicenses().subscribe(res => {
      this.licenses = res;
    });

    this.api.getInsurance().subscribe(res => {
      this.insurance = res;
    });


    this.api.getMaintenanceRecords().subscribe(res => {
      this.maintenanceRecords = res;
    });

    this.api.getPeriodicMaintenance().subscribe(res => {
      this.periodicMaintenance = res;
    });

    this.userStore.getFullNameFromStore().subscribe(val => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    timer(0, 1000).subscribe(() => {
      this.showSpinner = this.spinnerService.visibility.value;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}

  logout() {
    this.auth.signOut();
  }

  exportAsExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.contracts.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contracts');
    XLSX.writeFile(wb, 'contracts.xlsx');
  }
}
