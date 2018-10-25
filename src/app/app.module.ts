import { ToasterModule } from 'angular2-toaster';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { CommonService } from './common/services/common.service';
import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';
import { StorageService } from 'src/app/common/services/storage.service';
import { SessionStorageService } from './common/services/session.storage.service';
import { SessionService } from './common/services/session.service';
import { ToastService } from './common/services/toast.service';

import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AuthInterceptor } from './common/interceptor/auth.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToasterModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
