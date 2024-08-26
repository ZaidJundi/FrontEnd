import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRecordComponent } from './maintenanceRecord.component';

describe('DashboardComponent', () => {
  let component: MaintenanceRecordComponent;
  let fixture: ComponentFixture<MaintenanceRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
