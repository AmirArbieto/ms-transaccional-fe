import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarFormularioComponent } from './agregar-formulario.component';

describe('AgregarFormularioComponent', () => {
  let component: AgregarFormularioComponent;
  let fixture: ComponentFixture<AgregarFormularioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarFormularioComponent]
    });
    fixture = TestBed.createComponent(AgregarFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
