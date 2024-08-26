import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { SpinnerService } from '../../services/spinner.service';
import { timer } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-maintenanceRecord',
  templateUrl: './maintenanceRecord.component.html',
  styleUrls: ['./maintenanceRecord.component.scss']
})
export class MaintenanceRecordComponent implements OnInit, OnDestroy, AfterViewInit {
  public role!: string;
  public maintenanceRecords = new MatTableDataSource<any>([]);
  showSpinner: boolean = false;
  public displayedColumns: string[] = ['index',  'maintenanceDate', 'maintenanceDetails', 'licensePlate','additionalCost', 'typeOfMaintenance', 'notes'];
  @ViewChild(MatSort) sort!: MatSort;
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


    this.api.getMaintenanceRecords().subscribe(res => {
      console.log('Periodic Maintenance data:', res);

      this.maintenanceRecords.data = res;
      this.maintenanceRecords.sort = this.sort;
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
    this.maintenanceRecords.sort = this.sort;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}

  logout() {
    this.auth.signOut();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.maintenanceRecords.filter = filterValue.trim().toLowerCase();
  }

  exportAsExcel() {
    const exportData = this.maintenanceRecords.data.map((maintenanceRecord: any) => {
      return {

        'رقم لوحة المركبة': maintenanceRecord.licensePlate,
        'تفاصيل  الصيانة': maintenanceRecord.maintenanceRecord.maintenanceDetails,

        'تاريخ الصيانة': new Date(maintenanceRecord.maintenanceRecord.maintenanceDate).toLocaleDateString(),
          'تكلفة اضافية  ': maintenanceRecord.maintenanceRecord.additionalCost,
          'نوع الصيانة  ': this.getMaintenanceRecordsType(maintenanceRecord.maintenanceRecord.typeOfMaintenance),
          'ملاحظات': maintenanceRecord.maintenanceRecord.notes,


      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, `Maintenance_Records_data_${new Date().getTime()}.xlsx`);
  }
  getMaintenanceRecordsType(type: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'طارئة',
      1: ' استثنائي',
    };

    return statusMap[type] || 'غير معروف';
  }
}

