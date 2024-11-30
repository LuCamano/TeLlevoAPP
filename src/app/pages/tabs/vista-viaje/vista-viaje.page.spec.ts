import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaViajePage } from './vista-viaje.page';

describe('VistaViajePage', () => {
  let component: VistaViajePage;
  let fixture: ComponentFixture<VistaViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
