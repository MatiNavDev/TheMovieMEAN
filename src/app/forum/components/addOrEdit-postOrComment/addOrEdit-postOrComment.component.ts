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
  private editMessage: string = '';
  public addOrEditPostOrCommentForm: FormGroup;
  public postRelatedToComment: any;
  public commentOrPostType: 'comments' | 'posts';
  public editOrNewType: 'edit' | 'new';
  public itemId: string;
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
    debugger;
    this.itemId = this.route.snapshot.params.id;
    this.commentOrPostType = this.route.snapshot.queryParams.type;
    this.editOrNewType = this.route.snapshot.routeConfig.path.includes('edit') ? 'edit' : 'new';

    if (this.commentOrPostType === 'comments') {
      //TODO: mostrar titulo del post, si es new-comment
      this.shareForumSrvc
        .getPostRelatedToComment()
        .pipe(takeUntil(this.destroy$))
        .subscribe(postRelatedToComment => (this.postRelatedToComment = postRelatedToComment));
    }

    if (this.editOrNewType === 'edit') {
      //TODO: mostrar titulo del post, si es new-comment
      this.forumCommonSrvc
        .getEditMessage()
        .pipe(takeUntil(this.destroy$))
        .subscribe(editMessage => (this.editMessage = editMessage));
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
      message: [this.editMessage, [Validators.required, Validators.minLength(15)]]
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
   * Maneja el evento del actualizado de img
   * @param imgFile
   */
  public onUpdatedImg(imgFile) {
    this.addOrEditPostOrCommentForm.controls['img'].setValue(imgFile);
  }

  /**
   * Maneja el anadir un post.
   */
  public onAddPostOrComment() {
    this.loadingSrvc.show();
    this.forumSrvc
      .addPostOrComment(this.addOrEditPostOrCommentForm.value, this.commentOrPostType, this.itemId)
      .subscribe(lastPageUpdated => {
        /**
         * Aca tiene que devolver cual es la ultima pag desp de agregar el post, porque puede pasar que se agregue una nueva pagina,
         * y desp cuando quiera volver hacia atras e ir a la ultima pagina, esa va a estar desactualizada. Esto es solo para los comentarios
         * porque los posts estan ordenados de mas reciente al ultimo, entonces el mas reciente agregado va a estar al tope de la lista
         */
        if (this.commentOrPostType === 'comments')
          this.shareForumSrvc.setCommentLastPage(lastPageUpdated);

        this.router.navigate(['../'], {
          relativeTo: this.route,
          queryParams: { fromNew: true }
        });
      });
  }

  public onEditPostOrComment() {
    this.loadingSrvc.show();

    this.forumCommonSrvc
      .editPostOrComment(this.itemId, this.commentOrPostType, this.addOrEditPostOrCommentForm.value)
      .subscribe(lastPageUpdated => {
        // if (this.commentOrPostType === 'comments')
        //   this.shareForumSrvc.setCommentLastPage(lastPageUpdated);

        this.router.navigate(['../../../perfil'], {
          relativeTo: this.route,
          queryParams: { fromEdit: true }
        });
      });
  }

  public onCancel() {
    this.router.navigate(['../'], {
      relativeTo: this.route
    });
  }
}
