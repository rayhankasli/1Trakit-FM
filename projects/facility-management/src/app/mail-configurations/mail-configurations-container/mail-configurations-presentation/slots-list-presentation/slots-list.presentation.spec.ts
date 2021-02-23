import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsPresentationComponent } from './slots-presentation.component';

describe('SlotsPresentationComponent', () => {
  let component: SlotsPresentationComponent;
  let fixture: ComponentFixture<SlotsPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotsPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotsPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
