import { CommonService } from './../../../common/services/common.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../../common/services/error-handler.service';
import { LoadingService } from 'src/app/common/services/loading.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { ShareDataService } from '../../services/share-data.service';

@Component({
  selector: 'add-postOrComment',
  templateUrl: './add-postOrComment.component.html',
  styleUrls: ['./add-postOrComment.component.scss']
})
export class AddPostOrCommentComponent implements OnInit, OnDestroy {
  public addPostOrCommentForm: FormGroup;
  public postRelatedToComment: any;
  public type: 'comments' | 'posts';
  public postId: string;
  destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private loadingSrvc: LoadingService,
    private forumSrvc: ForumService,
    private router: Router,
    private route: ActivatedRoute,
    private shareForumSrvc: ShareDataService,
    private commonSrvc: CommonService
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.params.id;
    this.type = this.postId ? 'comments' : 'posts';

    if (this.type === 'comments') {
      //TODO: mostrar titulo del post, si es new-comment
      this.shareForumSrvc
        .getPostRelatedToComment()
        .pipe(takeUntil(this.destroy$))
        .subscribe(postRelatedToComment => (this.postRelatedToComment = postRelatedToComment));
    }

    this.initForm();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  /**
   * Inicia el formulario
   */
  private initForm() {
    this.addPostOrCommentForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.minLength(15)]]
    });
    //si viene un id es porque es un comment, y title e img van le corresponden a post
    if (!this.route.snapshot.params.id) {
      this.addPostOrCommentForm.addControl(
        'title',
        new FormControl('', [Validators.required, Validators.minLength(5)])
      );
      this.addPostOrCommentForm.addControl('img', new FormControl(''));
    }
  }

  /**
   * Maneja el evento del actualizado de img
   * @param imgFile
   */
  public onUpdatedImg(imgFile) {
    this.addPostOrCommentForm.controls['img'].setValue(imgFile);
  }

  /**
   * Maneja el anadir un post.
   */
  public onAddPostOrComment() {
    this.loadingSrvc.show();
    this.forumSrvc
      .addPostOrComment(this.addPostOrCommentForm.value, this.type, this.postId)
      .subscribe(lastPageUpdated => {
        /**
         * Aca tiene que devolver cual es la ultima pag desp de agregar el post, porque puede pasar que se agregue una nueva pagina,
         * y desp cuando quiera volver hacia atras e ir a la ultima pagina, esa va a estar desactualizada. Esto es solo para los comentarios
         * porque los posts estan ordenados de mas reciente al ultimo, entonces el mas reciente agregado va a estar al tope de la lista
         */
        if (this.type === 'comments') this.shareForumSrvc.setCommentLastPage(lastPageUpdated);

        this.router.navigate(['../'], {
          relativeTo: this.route,
          queryParams: { fromNew: true }
        });
      });
  }
}
