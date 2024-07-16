import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAgregarComponent } from './staff-agregar.component';

describe('StaffAgregarComponent', () => {
  let component: StaffAgregarComponent;
  let fixture: ComponentFixture<StaffAgregarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffAgregarComponent]
    });
    fixture = TestBed.createComponent(StaffAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
