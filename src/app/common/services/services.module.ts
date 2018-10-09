import { CommonService } from './common.service';
import { SessionService } from './session.service';
import { NgModule } from '@angular/core';
import { SessionStorageService } from 'src/app/common/services/session.storage.service';


@NgModule({
  declarations: [],
  providers:[
    SessionService,
    SessionStorageService,
    CommonService
  ]
})
export class CommonServicesModule { }
