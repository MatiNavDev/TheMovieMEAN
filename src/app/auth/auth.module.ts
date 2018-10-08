import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { GuardsModule } from 'src/app/common/guards/guards.module';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    GuardsModule
  ],
  declarations: [
    LoginComponent, 
    RegisterComponent
  ]
})
export class AuthModule { }
