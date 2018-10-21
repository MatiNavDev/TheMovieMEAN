import { CommonService } from './common/services/common.service';
import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';
import { StorageService } from 'src/app/common/services/storage.service';
import { SessionStorageService } from './common/services/session.storage.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from './common/services/session.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    SessionService,
    SessionStorageService,
    StorageService,
    CommonService,
    ErrorHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
