import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class internetCheckService {

    private internetStatusSubject = new Subject<boolean>();

  constructor() {
    this.checkInternetConnection();
  }

  private checkInternetConnection() {
    window.addEventListener('online', () => {
      this.internetStatusSubject.next(true);
    });

    window.addEventListener('offline', () => {
      this.internetStatusSubject.next(false);
    });
  }

  getInternetStatus() {
    return this.internetStatusSubject.asObservable();
  }
}