import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { AuthGuard } from 'src/app/common/guards/guard-auth.service';
import { RegisterComponent } from 'src/app/auth/components/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'registro',
    component: RegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
