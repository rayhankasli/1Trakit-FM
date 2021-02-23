import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterReadPresentationComponent } from './meter-read-presentation.component';

describe('MeterReadPresentationComponent', () => {
  let component: MeterReadPresentationComponent;
  let fixture: ComponentFixture<MeterReadPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterReadPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterReadPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
