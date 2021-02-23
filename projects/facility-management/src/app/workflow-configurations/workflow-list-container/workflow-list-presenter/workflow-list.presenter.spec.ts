import { TestBed } from '@angular/core/testing';

import { WorkflowPresenterService } from './workflow-presenter.service';

describe('WorkflowPresenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkflowPresenterService = TestBed.get(WorkflowPresenterService);
    expect(service).toBeTruthy();
  });
});
