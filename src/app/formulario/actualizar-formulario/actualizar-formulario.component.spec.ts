import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarFormularioComponent } from './actualizar-formulario.component';

describe('ActualizarFormularioComponent', () => {
  let component: ActualizarFormularioComponent;
  let fixture: ComponentFixture<ActualizarFormularioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarFormularioComponent]
    });
    fixture = TestBed.createComponent(ActualizarFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
