import { ForumCommonService } from './../../../common/services/forum-common.service';
import { CommonService } from '../../../common/services/common.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from '../../../common/services/error-handler.service';
import { LoadingService } from 'src/app/common/services/loading.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { ShareForumDataService } from '../../services/share-data.service';

@Component({
  selector: 'addOrEdit-postOrComment',
  templateUrl: './addOrEdit-postOrComment.component.html',
  styleUrls: ['./addOrEdit-postOrComment.component.scss']
})
export class AddOrEditPostOrCommentComponent implements OnInit, OnDestroy {
  private commentsPage: string;
  public addOrEditPostOrCommentForm: FormGroup;
  public postRelatedToComment: any;
  public commentOrPostType: 'comments' | 'posts';
  public postId: string;
  public commentId: string;
  destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private loadingSrvc: LoadingService,
    private forumSrvc: ForumService,
    private router: Router,
    private route: ActivatedRoute,
    private shareForumSrvc: ShareForumDataService,
    private forumCommonSrvc: ForumCommonService
  ) {}

  //TODO: arreglar el perfil y el foro para que esto ande. Ademas arreglarlo aca para que diferencie en el html cuando
  // add y cuando edit.

  ngOnInit() {
    this.postId = this.route.snapshot.params.postId;
    this.commentsPage = this.route.snapshot.queryParams.page;
    this.commentId = this.route.snapshot.params.commentId;
    this.commentOrPostType = this.route.snapshot.routeConfig.path.includes('comment')
      ? 'comments'
      : 'posts';

    if (this.commentOrPostType === 'comments' && !this.commentId) {
      //TODO: mostrar titulo del post, si es new-comment
      this.shareForumSrvc
        .getPostRelatedToComment()
        .pipe(takeUntil(this.destroy$))
        .subscribe(postRelatedToComment => (this.postRelatedToComment = postRelatedToComment));
    }

    if (this.commentId) {
      this.loadingSrvc.show();
      this.forumSrvc.getFullComment(this.commentId).subscribe(messageFromFullComment => {
        this.addOrEditPostOrCommentForm.controls['message'].setValue(messageFromFullComment);
        this.loadingSrvc.hide();
      });
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
    this.addOrEditPostOrCommentForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.minLength(15)]]
    });

    if (this.commentOrPostType === 'posts') {
      this.addOrEditPostOrCommentForm.addControl(
        'title',
        new FormControl('', [Validators.required, Validators.minLength(5)])
      );
      this.addOrEditPostOrCommentForm.addControl('img', new FormControl(''));
    }
  }

  /**
   * Maneja el anadir un post.
   */
  private onAddPostOrComment() {
    this.loadingSrvc.show();
    this.forumSrvc
      .addPostOrComment(this.addOrEditPostOrCommentForm.value, this.commentOrPostType, this.postId)
      .subscribe(lastPageUpdated => {
        /**
         * Aca tiene que devolver cual es la ultima pag desp de agregar el post, porque puede pasar que se agregue una nueva pagina,
         * y desp cuando quiera volver hacia atras e ir a la ultima pagina, esa va a estar desactualizada. Esto es solo para los comentarios
         * porque los posts estan ordenados de mas reciente al ultimo, entonces el mas reciente agregado va a estar al tope de la lista
         *
         * UPDATE 21/06/2019: para mi no, para mi hay que mandarle un parametro al server que diga "ultima pag" y listo, que el server se encargue
         */
        if (this.commentOrPostType === 'comments')
          this.shareForumSrvc.setCommentLastPage(lastPageUpdated);

        if (this.commentId) {
          this.router.navigate(['../../../perfil'], {
            relativeTo: this.route,
            queryParams: { page: this.commentsPage }
          });
        } else {
          this.router.navigate(['../'], {
            relativeTo: this.route,
            queryParams: { fromNew: true }
          });
        }
      });
  }

  private onEditComment() {
    this.loadingSrvc.show();

    this.forumCommonSrvc
      .editComment(this.commentId, this.addOrEditPostOrCommentForm.value)
      .subscribe(lastPageUpdated => {
        this.router.navigate(['../../../../perfil'], {
          relativeTo: this.route,
          queryParams: { page: this.commentsPage }
        });
      });
  }

  /**
   * Maneja el evento del actualizado de img
   * @param imgFile
   */
  public onUpdatedImg(imgFile) {
    this.addOrEditPostOrCommentForm.controls['img'].setValue(imgFile);
  }

  //TODO: hacer que cuando sea add-post, mande la pag, asi vuelve a la pagina de donde apreto el add
  public onCancel() {
    const queryParams = this.commentId ? { page: this.commentsPage } : null;

    this.router.navigate(['../'], {
      relativeTo: this.route,
      queryParams
    });
  }

  /**
   * Maneja ejecutar si es aniadir o editar
   */
  public onSavePostOrComment() {
    if (this.commentId) {
      this.onEditComment();
    } else {
      this.onAddPostOrComment();
    }
  }
}
