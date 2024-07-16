import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInactivosComponent } from './user-inactivos.component';

describe('UserInactivosComponent', () => {
  let component: UserInactivosComponent;
  let fixture: ComponentFixture<UserInactivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInactivosComponent]
    });
    fixture = TestBed.createComponent(UserInactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
