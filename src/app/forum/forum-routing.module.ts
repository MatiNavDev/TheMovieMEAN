import { AddOrEditPostOrCommentComponent } from './components/addOrEdit-postOrComment/addOrEdit-postOrComment.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { AuthGuard } from './../common/guards/guard-auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumComponent } from 'src/app/forum/forum.component';

const routes: Routes = [
  {
    path: 'anadir-post',
    component: AddOrEditPostOrCommentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/new-comment',
    component: AddOrEditPostOrCommentComponent
  },
  {
    path: ':id/edit-comment',
    component: AddOrEditPostOrCommentComponent
  },
  {
    path: ':id/edit-post',
    component: AddOrEditPostOrCommentComponent
  },
  {
    path: ':id',
    component: PostDetailComponent,
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
