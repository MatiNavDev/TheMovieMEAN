import { AuthGuard } from './../common/guards/guard-auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumComponent } from 'src/app/forum/forum.component';

const routes: Routes = [
  {
    path:'',
    component:ForumComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
