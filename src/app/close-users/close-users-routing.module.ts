import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CloseUsersComponent } from 'src/app/close-users/close-users.component';

const routes: Routes = [
  {
    path:'',
    component:CloseUsersComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloseUsersRoutingModule { }
