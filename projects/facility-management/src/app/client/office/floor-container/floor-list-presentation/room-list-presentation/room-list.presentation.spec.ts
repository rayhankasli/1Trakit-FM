import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPresentationComponent } from './room-presentation.component';

describe('RoomPresentationComponent', () => {
  let component: RoomPresentationComponent;
  let fixture: ComponentFixture<RoomPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
