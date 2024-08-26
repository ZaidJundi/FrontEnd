import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-dialog',
  template: `
    <h1 mat-dialog-title class="dialog-title">إضافة بلاغ</h1>
    <div mat-dialog-content class="dialog-content">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>رقم المركبة</mat-label>
        <mat-select [(ngModel)]="vehicleId">
          <mat-option *ngFor="let vehicle of vehicles" [value]="vehicle.id">
            {{ vehicle.licensePlate }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-divider></mat-divider>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>وصف المشكلة</mat-label>
        <textarea matInput [(ngModel)]="problemName" required></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onCancel()">إلغاء</button>
      <button mat-raised-button color="primary" (click)="onSubmit()">إرسال</button>
    </div>
  `,
  styles: [`
    .dialog-title {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: #006e63;
      margin-bottom: 15px;
    }
    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .full-width {
      width: 100%;
    }
    .dialog-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
    button {
      min-width: 100px;
    }
    :host {
      display: block;
      width: 600px;
      height: 400px;
    }
  `]
})
export class ReportDialogComponent implements OnInit {
  vehicleId: string = '';
  problemName: string = '';
  vehicles: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });
  }

  onCancel(): void {
    if (this.vehicleId || this.problemName) {
      Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'لديك تغييرات غير محفوظة. هل تريد إلغاء التغييرات؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، إلغاء',
        cancelButtonText: 'لا'
      }).then((result) => {
        if (result.isConfirmed) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  onSubmit(): void {
    if (!this.vehicleId || !this.problemName.trim()) {
      Swal.fire({
        title: 'حقول مطلوبة!',
        text: 'يرجى ملء جميع الحقول قبل الإرسال.',
        icon: 'warning',
        confirmButtonText: 'موافق'
      });
    } else {
      this.dialogRef.close({ vehicleId: this.vehicleId, problemName: this.problemName });
    }
  }
}
