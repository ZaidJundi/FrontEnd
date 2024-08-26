import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from './../../services/api.service';
import { AuthService } from './../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { SpinnerService } from './../../services/spinner.service';
import { timer } from 'rxjs';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-periodicMaintenance',
  templateUrl: './periodicMaintenance.component.html',
  styleUrls: ['./periodicMaintenance.component.scss']
})
export class PeriodicMaintenanceComponent implements OnInit, OnDestroy, AfterViewInit {
  public role!: string;
  public periodicMaintenance = new MatTableDataSource<any>([]);
  showSpinner: boolean = false;
  public displayedColumns: string[] = ['index', 'currentMileage', 'licensePlate', 'nextMileage', 'previousMaintenancDate', 'nextMaintenanceDate', 'carDeliveryDate','update'];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    public spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('ngOnInit called'); // طباعة عند استدعاء ngOnInit

    this.spinnerService.visibility.subscribe(show => {
      this.showSpinner = show;
      console.log('Spinner visibility:', show); // طباعة حالة الـ spinner
      this.cdr.detectChanges();
    });

    this.api.getPeriodicMaintenance().subscribe(res => {
      console.log('Periodic Maintenance data:', res); // طباعة بيانات الصيانة الدورية
      this.periodicMaintenance.data = res;
      this.periodicMaintenance.sort = this.sort;
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
      console.log('User role:', this.role); // طباعة دور المستخدم
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
    console.log('User logged out'); // طباعة عند تسجيل الخروج
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.periodicMaintenance.filter = filterValue.trim().toLowerCase();
    console.log('Filter applied:', filterValue); // طباعة عند تطبيق الفلتر
  }


  exportAsExcel() {
    const exportData = this.periodicMaintenance.data.map((periodicMaintenances: any) => {
      return {

        'رقم لوحة المركبة': periodicMaintenances.licensePlate,
        'الكيلومترات الحالية ': periodicMaintenances.periodicMaintenance.currentMileage,
        'الكيلومترات التالية  ': periodicMaintenances.periodicMaintenance.nextMileage,
        'تاريخ الصيانة السابقة': new Date(periodicMaintenances.periodicMaintenance.previousMaintenancDate).toLocaleDateString(),
        '  تاريخ الصيانةالتالية': new Date(periodicMaintenances.periodicMaintenance.nextMaintenanceDate).toLocaleDateString(),
        'تاريخ تسليم السيارة': new Date(periodicMaintenances.periodicMaintenance.carDeliveryDate).toLocaleDateString(),


      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, `Periodic_Maintenance_data_${new Date().getTime()}.xlsx`);
    console.log('Data exported as Excel');
  }
  async updateRow(id: string): Promise<void> {
    try {
        const data = await this.getPeriodicMaintenanceById(id);
        const result = await this.promptUpdate(data.currentMileage);

        if (result.isConfirmed) {
            await this.updateMileage(id, result.value.currentMileage);
            await this.refreshPeriodicMaintenanceData();
            this.showSuccessAlert();
        }
    } catch (error) {
        this.showErrorAlert(error);
    }
}

async getPeriodicMaintenanceById(id: string): Promise<any> {
    return this.api.getPeriodicMaintenanceById(id).toPromise();
}

async promptUpdate(currentMileage: number): Promise<any> {
    return Swal.fire({
        title: 'تحديث الكيلومترات الحالية',
        input: 'number',
        inputLabel: 'الكيلومترات الحالية',
        inputValue: currentMileage,
        showCancelButton: true,
        confirmButtonText: 'تحديث',
        cancelButtonText: 'إلغاء',
        preConfirm: (currentMileage) => {
            return { currentMileage: currentMileage };
        }
    });
}
dismissAlert() {
  const alertBox = document.getElementById('alertBox');
  if (alertBox) {
    alertBox.style.display = 'none';
  }
}

async updateMileage(id: string, currentMileage: number): Promise<any> {
    return this.api.updatePeriodicMaintenance(id, { currentMileage }).toPromise();
}

async refreshPeriodicMaintenanceData(): Promise<void> {
    const res = await this.api.getPeriodicMaintenance().toPromise();
    this.periodicMaintenance.data = res;
}

showSuccessAlert(): void {
    Swal.fire({
        icon: 'success',
        title: 'تم التحديث بنجاح',
        text: 'تم تحديث الكيلومترات بنجاح'
    });
}

showErrorAlert(error: any): void {
    const errorMessage = error.error.Error || error.error.error || 'حدث خطأ غير متوقع';
    Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: errorMessage
    });
}


}
