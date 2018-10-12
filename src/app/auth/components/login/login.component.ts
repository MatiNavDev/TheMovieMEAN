import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errors = {};

  constructor(
    private formBuilder: FormBuilder, private authSrvc:AuthService, private router:Router, private sessionSrvc:SessionService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(){
    this.loginForm = this.formBuilder.group({
      email:['',[Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]],
      password:['',[Validators.required, Validators.minLength(8)]]
    });
  }

  public onLogin(){
    this.authSrvc.login(this.loginForm.value)
    .subscribe(
      res=>{
        this.router.navigate(['../busquedas']);
      },
      errors=>{
        alert(JSON.stringify(errors,undefined,2));
      }
    )
  }
}
