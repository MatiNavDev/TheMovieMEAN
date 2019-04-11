import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'busquedas',
        loadChildren: '../../app/search/search.module#SearchModule'
      },
      {
        path: 'usuarios-cerca',
        loadChildren: '../../app/close-users/close-users.module#CloseUsersModule'
      },
      {
        path: 'foro',
        loadChildren: '../../app/forum/forum.module#ForumModule'
      },
      {
        path: 'perfil',
        loadChildren: '../../app/profile/profile.module#ProfileModule'
      },
      {
        path: 'autenticacion',
        loadChildren: '../../app/auth/auth.module#AuthModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
