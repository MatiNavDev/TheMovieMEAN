import { AddPostOrCommentComponent } from './components/add-postOrComment/add-postOrComment.component';
import { CommentsGhostsComponent } from './components/comments-ghosts/comments-ghosts.component';
import { PostsGhostsComponent } from './components/posts-ghosts/posts-ghosts.component';
import { CommentsComponent } from './components/post-detail/comments/comments.component';
import { CommentComponent } from './components/post-detail/comments/comment/comment.component';
import { PostComponent } from './components/posts/post/post.component';
import { FullPostComponent } from './components/post-detail/full-post/full-post.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/common/components/components.module';
import { ForumComponent } from './forum.component';
import { ForumHeaderComponent } from './components/forum-header/forum-header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { PostsComponent } from './components/posts/posts.component';

@NgModule({
  imports: [CommonModule, ForumRoutingModule, ComponentsModule, FormsModule, ReactiveFormsModule],
  declarations: [
    PostComponent,
    PostsComponent,
    ForumHeaderComponent,
    ForumComponent,
    PostDetailComponent,
    FullPostComponent,
    CommentsComponent,
    CommentComponent,
    PostsGhostsComponent,
    CommentsGhostsComponent,
    AddPostOrCommentComponent
  ]
})
export class ForumModule {}
