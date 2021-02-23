import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPresentationComponent } from './workflow-presentation.component';

describe('WorkflowPresentationComponent', () => {
  let component: WorkflowPresentationComponent;
  let fixture: ComponentFixture<WorkflowPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
