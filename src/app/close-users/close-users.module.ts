import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloseUsersRoutingModule } from './close-users-routing.module';
import { CloseUsersComponent } from 'src/app/close-users/close-users.component';

@NgModule({
  imports: [
    CommonModule,
    CloseUsersRoutingModule
  ],
  declarations: [
    CloseUsersComponent
  ]
})
export class CloseUsersModule { }
