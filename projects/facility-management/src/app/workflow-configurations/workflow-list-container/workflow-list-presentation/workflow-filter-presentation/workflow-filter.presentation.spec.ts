import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFilterPresentationComponent } from './workflow-filter.presentation';

describe('WorkflowFilterComponent', () => {
  let component: WorkflowFilterPresentationComponent;
  let fixture: ComponentFixture<WorkflowFilterPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowFilterPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowFilterPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
