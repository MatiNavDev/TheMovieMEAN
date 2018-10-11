import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from 'src/app/search/search.component';
import { AuthGuard } from 'src/app/common/guards/guard-auth.service';

const routes: Routes = [
  {
    path:'',
    component:SearchComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
