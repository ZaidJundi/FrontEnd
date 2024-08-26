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
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit, OnDestroy, AfterViewInit {
  public role!: string;
  public vehicles = new MatTableDataSource<any>([]);
  showSpinner: boolean = false;

  public displayedColumns: string[] = ['index','contractNumber',  'licensePlate', 'vin', 'vehicleType', 'vehicleColor', 'year', 'driverName', 'driverNumber'];
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


    this.api.getVehicles().subscribe(res => {
      this.vehicles.data = res;
console.log(res);
this.vehicles.sort = this.sort;
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
    this.vehicles.sort = this.sort;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.vehicles.filter = filterValue.trim().toLowerCase();
  }

  exportAsExcel() {
    const exportData = this.vehicles.data.map((vehicle: any) => {
      return {
        'رقم الشصي ': vehicle.vin,
        'رقم اللوجة ': vehicle.licensePlate,
        'نوع المركبة  ': vehicle.vehicleType,
        'لون المركبة  ': vehicle.vehicleColor,
        'سنة الانتاج ': vehicle.year,
        'اسم السائق  ': vehicle.driverName,
        'رقم السائق': vehicle.driverNumber,
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    const workbook: XLSX.WorkBook = { Sheets: { 'Vehicles': worksheet }, SheetNames: ['Vehicles'] };

    XLSX.writeFile(workbook, `vehicles_data_${new Date().getTime()}.xlsx`);
  }
}
