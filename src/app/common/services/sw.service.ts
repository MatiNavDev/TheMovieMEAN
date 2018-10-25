import { Injectable, ApplicationRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwService {

  constructor(
    private applicationRef:ApplicationRef
  ) { }


  /**
   * Configura el service worker
   */
  public setServiceWorker(){
    this.applicationRef.isStable.subscribe(isStable => {
      if (isStable) {
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
      }
    })
  }
}
