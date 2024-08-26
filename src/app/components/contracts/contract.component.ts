import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { timer } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, OnDestroy, AfterViewInit {
  public contracts = new MatTableDataSource<any>([]);
  showSpinner: boolean = false;
  public displayedColumns: string[] = ['index', 'contractId', 'startDateOfFinancing', 'endDateOfFinancing', 'contractStatus'];

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

    this.api.getContracts().subscribe(res => {
      this.contracts.data = res;
      this.contracts.sort = this.sort;
      console.log(res);
    });

    timer(0, 1000).subscribe(() => {
      this.showSpinner = this.spinnerService.visibility.value;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.contracts.sort = this.sort;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}

  logout() {
    this.auth.signOut();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.contracts.filter = filterValue.trim().toLowerCase();
  }

  exportAsExcel() {
    // تجهيز البيانات المطلوبة للتصدير
    const exportData = this.contracts.data.map((contract: any) => {
      return {
        'رقم العقد': contract.contractId,
        'تاريخ البداية': new Date(contract.startDateOfFinancing).toLocaleDateString(),
        'تاريخ النهاية': new Date(contract.endDateOfFinancing).toLocaleDateString(),
        'الحالة': this.getContractStatus(contract.contractStatus)
      };
    });

    // إنشاء ورقة عمل من البيانات المجهزة
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // إنشاء ملف Excel
    const workbook: XLSX.WorkBook = { Sheets: { 'Contracts': worksheet }, SheetNames: ['Contracts'] };

    // كتابة الملف وتسميته مع إضافة طابع زمني
    XLSX.writeFile(workbook, `contract_data_${new Date().getTime()}.xlsx`);
  }



  getContractStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'تحت التمويل',
      2: ' تمت عملية التمويل ',
      3: ' لم تكتمل عملية التمويل ',
      4: ' ستنتهي عملية التمويل قريباً'
    };

    return statusMap[status] || 'غير معروف';
  }

}
