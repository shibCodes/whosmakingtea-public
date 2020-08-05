import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPopComponent } from './aboutpop.component';

describe('AboutPopComponent', () => {
  let component: AboutPopComponent;
  let fixture: ComponentFixture<AboutPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutPopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
