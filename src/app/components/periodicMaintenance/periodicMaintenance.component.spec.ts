import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicMaintenanceComponent } from './periodicMaintenance.component';

describe('DashboardComponent', () => {
  let component: PeriodicMaintenanceComponent;
  let fixture: ComponentFixture<PeriodicMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodicMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodicMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
