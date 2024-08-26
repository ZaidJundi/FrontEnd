import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { timer } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy, AfterViewInit {
  public notifications = new MatTableDataSource<any>([]);
  showSpinner: boolean = false;
  public displayedColumns: string[] = ['index', 'type', 'message', 'phoneNumber','creationTime', 'status'];

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

    this.api.getNotifications().subscribe(res => {
      this.notifications.data = res;
      this.notifications.sort = this.sort;
      console.log(res);
    });

    timer(0, 1000).subscribe(() => {
      this.showSpinner = this.spinnerService.visibility.value;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.notifications.sort = this.sort;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}

  logout() {
    this.auth.signOut();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.notifications.filter = filterValue.trim().toLowerCase();
  }
  exportAsExcel() {
    const exportData = this.notifications.data.map((notification: any) => {
      return {
        'نوع التذكير  ': this.getNotificationType(notification.type),
        'الرسالة': notification.message,
        'رقم الهاتف  ': notification.phoneNumber,
        'تاريخ الارسال ': new Date(notification.creationTime).toLocaleDateString(),
        'حالة الارسال   ': this.getNotificationStatus(notification.status),
      };
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, `Notification_data_${new Date().getTime()}.xlsx`);
  }
  getNotificationType(type: number): string {
    const typesMap: { [key: number]: string } = {
      0: 'عقد تمويل',
      1: 'تأمين',
      2: 'ترخيص',
      3: ' ',
      4: 'صيانة دورية',
      5: 'خاصة'
    };

    return typesMap[type] || 'غير معروف';
  }

  getNotificationStatus(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'رسالة SMS ',
      1: 'واتساب',
      2: 'لم يتم ارسالها',
      3: ' من البورتل'
    };

    return statusMap[status] || 'غير معروف';
  }
}
