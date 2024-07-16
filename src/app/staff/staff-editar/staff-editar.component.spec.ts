import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffEditarComponent } from './staff-editar.component';

describe('StaffEditarComponent', () => {
  let component: StaffEditarComponent;
  let fixture: ComponentFixture<StaffEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffEditarComponent]
    });
    fixture = TestBed.createComponent(StaffEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
