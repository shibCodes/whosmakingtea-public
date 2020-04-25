import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadySpinComponent } from './loadyspin.component';

describe('LoadySpinComponent', () => {
  let component: LoadySpinComponent;
  let fixture: ComponentFixture<LoadySpinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadySpinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadySpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
