import { ComponentsModule } from 'src/app/common/components/components.module';
import { UserBoxComponent } from './user-box/user-box.component';
import { ForumBoxComponent } from './forum-box/forum-box.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from 'src/app/profile/profile.component';

@NgModule({
  imports: [CommonModule, ProfileRoutingModule, ComponentsModule],
  declarations: [ProfileComponent, ForumBoxComponent, UserBoxComponent]
})
export class ProfileModule {}
