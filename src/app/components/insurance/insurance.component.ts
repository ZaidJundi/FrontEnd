import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { timer } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit, OnDestroy, AfterViewInit {

  public insurance = new MatTableDataSource<any>([]);

  showSpinner: boolean = false;

  public displayedColumns: string[] = ['index',  'insuranceCompany', 'licensePlate', 'insuranceStartDate', 'insuranceEndtDate','insuranceStatus'];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.spinnerService.visibility.subscribe(show => {
      this.showSpinner = show;
      this.cdr.detectChanges();
    });

    this.api.getInsurance().subscribe(res => {
      this.insurance.data = res;
      this.insurance.sort = this.sort;
      console.log(res);
    });

    timer(0, 1000).subscribe(() => {
      this.showSpinner = this.spinnerService.visibility.value;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.insurance.sort = this.sort;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}

  logout() {
    this.auth.signOut();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.insurance.filter = filterValue.trim().toLowerCase();
  }


  exportAsExcel() {
    const exportData = this.insurance.data.map((insurances: any) => {
      return {

        'رقم لوحة المركبة': insurances.licensePlate,
        'شركة التأمين': insurances.insurance.insuranceCompany,
        'تاريخ البداية': new Date(insurances.insurance.insuranceStartDate).toLocaleDateString(),
        'تاريخ النهاية': new Date(insurances.insurance.insuranceEndtDate).toLocaleDateString(),
        'الحالة': this.getInsuranceStatus(insurances.insurance.insuranceStatus)
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, `insurance_data_${new Date().getTime()}.xlsx`);
  }
  getInsuranceStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'منتهي ',
      1: '  فعال  ',
      2: ' سينتهي قريباً',
    };

    return statusMap[status] || 'غير معروف';
  }
}
