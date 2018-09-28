import { TestBed, inject } from '@angular/core/testing';

import { DiagramDatasetService } from './diagram-dataset.service';

describe('DiagramDatasetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiagramDatasetService]
    });
  });

  it('should be created', inject([DiagramDatasetService], (service: DiagramDatasetService) => {
    expect(service).toBeTruthy();
  }));
});
