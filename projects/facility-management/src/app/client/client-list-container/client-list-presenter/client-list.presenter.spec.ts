import { TestBed } from '@angular/core/testing';

import { ClientPresenterService } from './client-presenter.service';

describe('ClientPresenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientPresenterService = TestBed.get(ClientPresenterService);
    expect(service).toBeTruthy();
  });
});
