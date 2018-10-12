import { CommonService } from './common.service';
import { SessionService } from './session.service';
import { NgModule } from '@angular/core';
import { SessionStorageService } from 'src/app/common/services/session.storage.service';
import { StorageService } from 'src/app/common/services/storage.service';
import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';


@NgModule({
  declarations: [],
  providers:[
    SessionService,
    SessionStorageService,
    CommonService,
    StorageService,
    ErrorHandlerService
  ]
})
export class CommonServicesModule { }
