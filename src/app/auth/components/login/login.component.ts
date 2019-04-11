import { ErrorHandlerService } from './../../../common/services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthRequestService } from 'src/app/auth/services/auth-request.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/common/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public errors: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private authRequestSrvc: AuthRequestService,
    private router: Router,
    private errorSrvc: ErrorHandlerService,
    private loadingSrvc: LoadingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$')
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  public onLogin() {
    this.loadingSrvc.show();
    this.authRequestSrvc.userLogin(this.loginForm.value).subscribe(
      res => {
        this.loadingSrvc.hide();
        this.router.navigate(['../../foro'], { relativeTo: this.route });
      },
      errors => {
        this.loadingSrvc.hide();
        this.errorSrvc.showErrorsToUser(errors);
      }
    );
  }
}
