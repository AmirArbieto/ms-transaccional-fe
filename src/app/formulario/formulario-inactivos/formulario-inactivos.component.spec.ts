import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioInactivosComponent } from './formulario-inactivos.component';

describe('FormularioInactivosComponent', () => {
  let component: FormularioInactivosComponent;
  let fixture: ComponentFixture<FormularioInactivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioInactivosComponent]
    });
    fixture = TestBed.createComponent(FormularioInactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
