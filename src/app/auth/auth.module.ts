import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { GuardsModule } from 'src/app/common/guards/guards.module';
import { CommonServicesModule } from 'src/app/common/services/services.module';
import { AuthService } from 'src/app/auth/services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    GuardsModule,
    CommonServicesModule
  ],
  providers:[
    AuthService
  ],
  declarations: [
    LoginComponent, 
    RegisterComponent
  ]
})
export class AuthModule { }
