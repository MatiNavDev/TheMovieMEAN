import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';
import { AuthGuard } from 'src/app/common/guards/guard-auth.service';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
    canActivate:[AuthGuard],
    children:[
      {
        path:'',
        redirectTo:'busquedas',
        pathMatch:'full'
      },
      {
        path:'busquedas',
        loadChildren: "../../app/search/search.module#SearchModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
