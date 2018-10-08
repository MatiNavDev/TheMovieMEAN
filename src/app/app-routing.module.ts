import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "auth",
    loadChildren: "../app/auth/auth.module#AuthModule"
  },
  {
    path: "home",
    loadChildren: "../app/home/home.module#HomeModule"
  },
  {
    path: '',
    redirectTo:'home',
    pathMatch:'full'
  },
  {
    path: '**',
    redirectTo:'home',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
