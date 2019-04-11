import { Router } from '@angular/router';
import { ErrorHandlerService } from './../../../common/services/error-handler.service';
import { LoadingService } from 'src/app/common/services/loading.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {
  public addPostForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingSrvc: LoadingService,
    private postSrvc: PostService,
    private errorSrvc: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  /**
   * Inicia el formulario
   */
  private initForm() {
    this.addPostForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(15)]],
      img: ['']
    });
  }

  public onUpdatedImg() {}

  /**
   * Maneja el anadir un post.
   */
  public onAddPost() {
    this.loadingSrvc.show();
    this.postSrvc.addPost(this.addPostForm.value).subscribe(
      () => {
        debugger;
        this.loadingSrvc.hide();
        this.router.navigate(['home/foro']);
      },
      error => {
        debugger;
        this.loadingSrvc.hide();
        this.errorSrvc.showErrorsToUser(error);
      }
    );
  }
}
