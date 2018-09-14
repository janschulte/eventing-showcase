import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionSelectorComponent } from './subscription-selector.component';

describe('SubscriptionSelectorComponent', () => {
  let component: SubscriptionSelectorComponent;
  let fixture: ComponentFixture<SubscriptionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
