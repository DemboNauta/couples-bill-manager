import { TestBed } from '@angular/core/testing';

import { TicketingService } from './ticketing.service';

describe('TicketingService', () => {
  let service: TicketingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
