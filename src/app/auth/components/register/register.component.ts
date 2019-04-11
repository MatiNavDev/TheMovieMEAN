import { LoadingService } from 'src/app/common/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthRequestService } from '../../services/auth-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public errors = [];
  public regForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authRequestSrvc: AuthRequestService,
    private router: Router,
    private route: ActivatedRoute,
    private errorSrvc: ErrorHandlerService,
    private loadingSrvc: LoadingService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  /**
   * Inicia el formulario
   */
  private initForm() {
    this.regForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(1)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$')
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      img: ['']
    });
  }

  /**
   * Maneja el registrar un usuario
   */
  public onRegister() {
    this.loadingSrvc.show();
    this.authRequestSrvc.userRegister(this.regForm.value).subscribe(
      res => {
        this.loadingSrvc.hide();

        this.router.navigate(['../../busquedas'], { relativeTo: this.route });
      },
      errors => {
        this.loadingSrvc.hide();
        this.errorSrvc.showErrorsToUser(errors);
      }
    );
  }

  /**
   * Maneja el evento del actualizado de img
   * @param imgFile
   */
  public onUpdatedImg(imgFile) {
    this.regForm.controls['img'].setValue(imgFile);
  }
}
