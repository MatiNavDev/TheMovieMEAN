import { NgModule } from '@angular/core';
import { AuthGuard } from 'src/app/common/guards/guard-auth.service';
import { ServicesModule } from 'src/app/common/services/services.module';

@NgModule({
  imports:[
    ServicesModule
  ],
  declarations: [],
  providers:[AuthGuard]
})
export class GuardsModule { }
