import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventingMapComponent } from './eventing-map.component';

describe('EventingMapComponent', () => {
  let component: EventingMapComponent;
  let fixture: ComponentFixture<EventingMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventingMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
