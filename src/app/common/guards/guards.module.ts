import { CommonServicesModule } from 'src/app/common/services/services.module';
import { NgModule } from '@angular/core';
import { AuthGuard } from 'src/app/common/guards/guard-auth.service';

@NgModule({
  imports:[
    CommonServicesModule
  ],
  declarations: [],
  providers:[AuthGuard]
})
export class GuardsModule { }
