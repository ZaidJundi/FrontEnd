import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-dialog',
  template: `
    <h1 mat-dialog-title>اضافة بلاغ</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>رقم المركبة</mat-label>
        <input matInput [(ngModel)]="data.vehicleId">
      </mat-form-field>
      <mat-form-field>
        <mat-label>وصف المشكلة</mat-label>
        <input matInput [(ngModel)]="data.problemName">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">إلغاء</button>
      <button mat-button [mat-dialog-close]="data">إضافة</button>
    </div>
  `,
})
export class ReportDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleId: string; problemName: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
