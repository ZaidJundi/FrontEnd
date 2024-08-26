import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { timer } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit, OnDestroy, AfterViewInit {
  public licenses = new MatTableDataSource<any>([]);
  showSpinner: boolean = false;
  public displayedColumns: string[] = ['index', 'licensePlate', 'licenseStartDate', 'licenseEndtDate', 'licenseStatus'];
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

    this.api.getLicenses().subscribe(res => {
      this.licenses.data = res;
      this.licenses.sort = this.sort;
    });




    timer(0, 1000).subscribe(() => {
      this.showSpinner = this.spinnerService.visibility.value;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.licenses.sort = this.sort;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}

  logout() {
    this.auth.signOut();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.licenses.filter = filterValue.trim().toLowerCase();
  }

  exportAsExcel() {
    const exportData = this.licenses.data.map((license: any) => {
      return {

        'رقم لوحة المركبة': license.licensePlate,
        'تاريخ البداية': new Date(license.license.licenseStartDate).toLocaleDateString(),
        'تاريخ النهاية': new Date(license.license.licenseEndtDate).toLocaleDateString(),
        'الحالة': this.getLicensesStatus(license.license.licenseStatus)
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    XLSX.writeFile(workbook, `license_data_${new Date().getTime()}.xlsx`);
  }

  getLicensesStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'منتهي ',
      1: '  فعال  ',
      2: ' سينتهي قريباً',
    };

    return statusMap[status] || 'غير معروف';
  }
}
