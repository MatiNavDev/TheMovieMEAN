import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/common/components/components.module';
import { ForumComponent } from './forum.component';
import { ForumHeaderComponent } from './components/forum-header/forum-header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { PostComponent } from './components/posts/post/post.component';
import { PostsComponent } from './components/posts/posts.component';
import { AddPostComponent } from './components/add-post/add-post.component';

@NgModule({
  imports: [CommonModule, ForumRoutingModule, ComponentsModule, FormsModule, ReactiveFormsModule],
  declarations: [
    PostComponent,
    PostsComponent,
    ForumHeaderComponent,
    ForumComponent,
    AddPostComponent,
    AddPostComponent
  ]
})
export class ForumModule {}
