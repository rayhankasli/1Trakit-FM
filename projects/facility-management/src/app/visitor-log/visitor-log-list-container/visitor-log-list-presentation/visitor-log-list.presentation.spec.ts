import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorLogPresentationComponent } from './visitor-log-presentation.component';

describe('VisitorLogPresentationComponent', () => {
  let component: VisitorLogPresentationComponent;
  let fixture: ComponentFixture<VisitorLogPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorLogPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorLogPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
