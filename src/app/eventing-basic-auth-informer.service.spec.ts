import { TestBed, inject } from '@angular/core/testing';

import { EventingBasicAuthInformerService } from './eventing-basic-auth-informer.service';

describe('EventingBasicAuthInformerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventingBasicAuthInformerService]
    });
  });

  it('should be created', inject([EventingBasicAuthInformerService], (service: EventingBasicAuthInformerService) => {
    expect(service).toBeTruthy();
  }));
});
