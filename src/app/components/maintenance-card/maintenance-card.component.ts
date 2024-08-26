import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from './../../services/api.service';
import { AuthService } from './../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { SpinnerService } from './../../services/spinner.service';
import { timer } from 'rxjs';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-maintenance-card',
  templateUrl: './maintenance-card.component.html',
  styleUrl: './maintenance-card.component.scss'
})
export class MaintenanceCardComponent implements OnInit, OnDestroy, AfterViewInit {
  public role!: string;
  public periodicMaintenance = new MatTableDataSource<any>([]);
  showSpinner: boolean = false;
  public displayedColumns: string[] = ['index', 'nameOfMaMaintenanceType', 'licensePlate',  'dateOfEvent',  'note', 'statusOfEvent'];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    public spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('ngOnInit called');

    this.spinnerService.visibility.subscribe(show => {
      this.showSpinner = show;
      console.log('Spinner visibility:', show);
      this.cdr.detectChanges();
    });

    this.api.getMaintenaneCard().subscribe(res => {
      console.log(res.value);
      this.periodicMaintenance.data = res.value;
      this.periodicMaintenance.sort = this.sort;
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
      console.log('User role:', this.role);
    });

    timer(0, 1000).subscribe(() => {
      this.showSpinner = this.spinnerService.visibility.value;
      this.cdr.detectChanges();
    });

  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called'); // طباعة عند استدعاء ngAfterViewInit
    this.periodicMaintenance.sort = this.sort;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called'); // طباعة عند استدعاء ngOnDestroy
  }

  logout() {
    this.auth.signOut();
    console.log('User logged out');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.periodicMaintenance.filter = filterValue.trim().toLowerCase();
    console.log('Filter applied:', filterValue);
  }
  exportAsExcel() {
    const exportData = this.periodicMaintenance.data.map((periodicMaintenances: any) => {
      return {

        'رقم لوحة المركبة': periodicMaintenances.licensePlate,
        'نوع الصيانة ': periodicMaintenances.nameOfMaMaintenanceType,

        'تاريخ الصيانة  ': new Date(periodicMaintenances.vehicleMaintenances.dateOfEvent).toLocaleDateString(),
        'ملاحظات': periodicMaintenances.vehicleMaintenances.note,
        'الحالة': this.getMaintenanceStatus(periodicMaintenances.vehicleMaintenances.statusOfEvent)
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    XLSX.writeFile(workbook, `Periodic_Maintenance_data_${new Date().getTime()}.xlsx`);
  }

  getMaintenanceStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'لم تتم ',
      1: ' تمت  الصيانة ',

    };

    return statusMap[status] || 'غير معروف';
  }
}

