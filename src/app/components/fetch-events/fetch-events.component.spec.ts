import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchEventsComponent } from './fetch-events.component';

describe('FetchEventsComponent', () => {
  let component: FetchEventsComponent;
  let fixture: ComponentFixture<FetchEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
