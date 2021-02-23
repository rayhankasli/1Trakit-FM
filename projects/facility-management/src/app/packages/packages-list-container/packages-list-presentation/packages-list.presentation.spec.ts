import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesPresentationComponent } from './packages-presentation.component';

describe('PackagesPresentationComponent', () => {
  let component: PackagesPresentationComponent;
  let fixture: ComponentFixture<PackagesPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagesPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
