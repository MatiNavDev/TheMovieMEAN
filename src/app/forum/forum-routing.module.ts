import { AddPostComponent } from './components/add-post/add-post.component';
import { AuthGuard } from './../common/guards/guard-auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumComponent } from 'src/app/forum/forum.component';

const routes: Routes = [
  {
    path: 'anadir-post',
    component: AddPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: ForumComponent
  },
  { path: '**', component: ForumComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule {}
