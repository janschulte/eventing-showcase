import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventingDiagramComponent } from './eventing-diagram.component';

describe('EventingDiagramComponent', () => {
  let component: EventingDiagramComponent;
  let fixture: ComponentFixture<EventingDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventingDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventingDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
