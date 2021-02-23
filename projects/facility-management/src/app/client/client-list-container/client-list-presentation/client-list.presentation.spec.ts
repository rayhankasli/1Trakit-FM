import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPresentationComponent } from './client-presentation.component';

describe('ClientPresentationComponent', () => {
  let component: ClientPresentationComponent;
  let fixture: ComponentFixture<ClientPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
