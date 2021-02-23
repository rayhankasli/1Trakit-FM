import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPresentationComponent } from './dashboard.presentation';

describe('DashboardPresentationComponent', () => {
  let component: DashboardPresentationComponent;
  let fixture: ComponentFixture<DashboardPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPresentationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
