import { Injectable, ApplicationRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwService {

  private swFlag: boolean;

  constructor(
    private applicationRef: ApplicationRef
  ) { }


  /**
   * Configura el service worker
   */
  public setServiceWorker() {

    const subscription: Subscription = this.applicationRef.isStable.subscribe(isStable => {
      if (isStable) {
        this.swFlag = true
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('ngsw-worker.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }).catch(function (err) {
            //registration failed :(
            console.log('ServiceWorker registration failed: ', err);
          });
        } else {
          console.log('No service-worker on this browser');
        }
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    })
    
  }
}
