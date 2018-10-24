import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const self = this;
this.ngZone.runOutsideAngular(() => {
  this.slideIntervalId = setInterval(() => {
    self.ngZone.run(() => {
      platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
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
      }).catch(err => console.log(err));
      this.cd.markForCheck();
    });
  }, 5000);
});