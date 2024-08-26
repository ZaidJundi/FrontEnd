import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { timer } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit, OnDestroy, AfterViewInit {

  public report = new MatTableDataSource<any>([]);

  showSpinner: boolean = false;

  public displayedColumns: string[] = ['index',  'licensePlate', 'problemName', 'note','creationTime', 'reportStatus'];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private auth: AuthService,
    public spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.spinnerService.visibility.subscribe(show => {
      this.showSpinner = show;
      this.cdr.detectChanges();
      this.loadReports();
    });
  }

  loadReports() {
    this.api.getReports().subscribe(res => {
      this.report.data = res;
      this.report.sort = this.sort;
      console.log(res);
    });

    timer(0, 1000).subscribe(() => {
      this.showSpinner = this.spinnerService.visibility.value;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.report.sort = this.sort;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}

  logout() {
    this.auth.signOut();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.report.filterPredicate = (data: any, filter: string) => {
      const accumulator = (currentTerm: string, key: string) => currentTerm + data[key];
      let dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();

      const nestedFields = ['report.problemName', 'report.note', 'report.creationTime', 'report.reportStatus'];
      nestedFields.forEach(field => {
        const value = this.getFieldValue(data, field);
        if (value) {
          dataStr += value.toString().toLowerCase();
        }
      });

      return dataStr.indexOf(filter) !== -1;
    };

    this.report.filter = filterValue;
  }

  getFieldValue(data: any, field: string): any {
    return field.split('.').reduce((acc, part) => acc && acc[part], data);
  }

  exportAsExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.report.data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, `report_data_${new Date().getTime()}.xlsx`);
  }
  getReportStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'في انتظار الموافقة ',
      1: '  تحت المعالجة  ',
      3: ' تمت المعالجة بنجاح',
    };

    return statusMap[status] || 'غير معروف';
  }


  Add(): void {
    const dialogRef = this.dialog.open(ReportDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.reportIncident(result.vehicleId, result.problemName).subscribe(response => {
          console.log('Report created successfully', response);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message,
            timer: 5000,
          });
          this.loadReports();
        }, error => {
          console.error('Error creating report', error);

        });
      }
    });
  }
}
