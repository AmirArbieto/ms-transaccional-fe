import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffInactivosComponent } from './staff-inactivos.component';

describe('StaffInactivosComponent', () => {
  let component: StaffInactivosComponent;
  let fixture: ComponentFixture<StaffInactivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffInactivosComponent]
    });
    fixture = TestBed.createComponent(StaffInactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
