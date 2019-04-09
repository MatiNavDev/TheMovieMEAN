import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from '../../common/services/error-handler.service';
import { LoadingService } from 'src/app/common/services/loading.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient,
    private errorSrvc: ErrorHandlerService,
    private loadingSrvc: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Hace el post de la img del usuario
   * @param image
   */
  private uploadImage(image: File): Observable<any> {
    let formData: FormData = new FormData();

    formData.append('image', image);

    return this.http.post(environment.url + 'image-upload', formData);
  }

  /**
   * Maneja el enviarle anadir un post en el servidor
   * @param data
   */
  public async addPost(post) {
    //TODO: Manejar el guardar el post, y guardar la imagen en el server
    try {
      await this.http.post(environment.url + 'post', post);
      this.loadingSrvc.hide();
      this.router.navigate(['home/foro']);
    } catch (errors) {
      this.loadingSrvc.hide();
      this.errorSrvc.showErrorsToUser(errors);
    }
  }
}
