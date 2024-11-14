import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDatosPage } from './change-datos.page';

describe('ChangeDatosPage', () => {
  let component: ChangeDatosPage;
  let fixture: ComponentFixture<ChangeDatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
