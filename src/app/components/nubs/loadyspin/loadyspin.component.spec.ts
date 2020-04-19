import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadyspinComponent } from './loadyspin.component';

describe('LoadyspinComponent', () => {
  let component: LoadyspinComponent;
  let fixture: ComponentFixture<LoadyspinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadyspinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadyspinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
