import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>تأكيد الإلغاء</h1>
    <div mat-dialog-content>
      <p>هل أنت متأكد من رغبتك في إلغاء التغييرات؟</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">لا</button>
      <button mat-button color="warn" (click)="onConfirm()">نعم</button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
