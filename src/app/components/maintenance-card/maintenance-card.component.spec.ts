import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCardComponent } from './maintenance-card.component';

describe('MaintenanceCardComponent', () => {
  let component: MaintenanceCardComponent;
  let fixture: ComponentFixture<MaintenanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
