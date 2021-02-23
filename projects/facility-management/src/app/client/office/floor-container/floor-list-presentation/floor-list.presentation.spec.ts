import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorPresentationComponent } from './floor-presentation.component';

describe('FloorPresentationComponent', () => {
  let component: FloorPresentationComponent;
  let fixture: ComponentFixture<FloorPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
