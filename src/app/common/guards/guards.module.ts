import { NgModule } from '@angular/core';
import { AuthGuard } from 'src/app/common/guards/guard-auth.service';

@NgModule({
  imports:[
  ],
  declarations: [],
  providers:[AuthGuard]
})
export class GuardsModule { }
