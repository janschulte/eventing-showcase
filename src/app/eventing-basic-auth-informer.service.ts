import { Injectable } from '@angular/core';
import { BasicAuthInformer, BasicAuthService } from '@helgoland/auth';
import { Observable, Observer } from 'rxjs';

import { eventing } from '../environments/credentials';

@Injectable({
  providedIn: 'root'
})
export class EventingBasicAuthInformerService implements BasicAuthInformer {

  constructor(
    private basicAuthSrvc: BasicAuthService
  ) { }

  public doBasicAuth(url: string): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      this.basicAuthSrvc.auth(eventing.username, eventing.password, url).subscribe(
        () => {
          observer.next(true);
          observer.complete();
        },
        () => {
          observer.next(false);
          observer.complete();
        }
      );
    });
  }
}
