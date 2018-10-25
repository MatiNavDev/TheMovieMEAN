import { Component, OnInit, ApplicationRef } from '@angular/core';
import { SessionService } from './common/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private sessionSrvc: SessionService, private applicationRef: ApplicationRef
  ) {
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

  ngOnInit() {
    this.sessionSrvc.isAuthenticated();

  }

}
