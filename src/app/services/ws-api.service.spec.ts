import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { TestScheduler } from 'rxjs/testing';

import { asyncData, asyncError } from '../../testing';
import { CasTicketService } from './cas-ticket.service';
import { WsApiService } from './ws-api.service';

describe('WsApiService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let networkSpy: jasmine.Spy;
  let storageSpy: { get: jasmine.Spy, set: jasmine.Spy };
  let casSpy: jasmine.Spy;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const network = jasmine.createSpyObj('Network', ['type']);
    networkSpy = network.type;
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);
    const cas = jasmine.createSpyObj('CasTicketService', ['getST']);
    casSpy = cas.getST;
    cas.getST.and.returnValue(asyncData('ticket'));

    TestBed.configureTestingModule({
      providers: [
        { provide: CasTicketService, useValue: cas },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Network, useValue: network },
        { provide: Storage, useValue: storageSpy },
      ]
    });
  });

  it('should be created', () => {
    const service: WsApiService = TestBed.get(WsApiService);
    expect(service).toBeTruthy();
  });

  it('should return error after retries if no cache', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run(({ expectObservable }) => {
      storageSpy.get.and.returnValue(asyncData(null));
      httpClientSpy.get.and.returnValue(asyncError('failed'));

      const service: WsApiService = TestBed.get(WsApiService);
      expectObservable(service.get('/api')).toBe('---');
    });

    expect(networkSpy).not.toHaveBeenCalled();
    expect(casSpy).toHaveBeenCalled();
  });
});
