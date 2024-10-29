import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmViajesPage } from './adm-viajes.page';

describe('AdmViajesPage', () => {
  let component: AdmViajesPage;
  let fixture: ComponentFixture<AdmViajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
